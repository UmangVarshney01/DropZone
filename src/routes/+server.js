import express from 'express';
import multer from 'multer';
import {Client} from 'minio';
import minio from '$lib/properties/minioRequirement.js';
import {serverPort, serverURL } from '$lib/properties/serverHost.js';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const Url=serverURL;
const port=serverPort;

// Enable CORS for all routes
app.use(cors());

// Set up multer for file upload
const upload = multer({ dest: 'uploads/' });

// Set up MinIO client
const minioClient = new Client({
    endPoint: minio.endPoint,
    port: minio.port,
    useSSL: minio.useSSL, 
    accessKey: minio.accessKey,
    secretKey: minio.secretKey
});


// Create a bucket if it doesn't exist
const bucketName = minio.bucketName;
minioClient.bucketExists(bucketName, (err, exists) => {
    if (err) {
        return console.log(err);
    }
    if (!exists) {
        minioClient.makeBucket(bucketName, 'us-east-1', (err) => {
            if (err) return console.log('Error creating bucket.', err);
            console.log('Bucket created successfully in "us-east-1".');
        });
    }
});

// Handle file upload
app.post('/upload', upload.array('files'), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }

    const uploadPromises = req.files.map(file => {
        const filePath = path.join(path.resolve(), file.path);
        const fileStream = fs.createReadStream(filePath);
        const metaData = {
            'Content-Type': file.mimetype
        };

        return new Promise((resolve, reject) => {
            minioClient.putObject(bucketName, file.originalname, fileStream, file.size, metaData, (err, etag) => {
                fs.unlinkSync(filePath); // Delete the file after upload
                if (err) {
                    reject(err);
                } else {
                    resolve(etag);
                }
            });
        });
    });

    Promise.all(uploadPromises)
        .then(etags => res.send('Files uploaded successfully.'))
        .catch(err => res.status(500).send('Error uploading files.'));
});

// Handle file download
app.get('/download/:filename', (req, res) => {
    const fileName = req.params.filename;

    minioClient.statObject(bucketName, fileName, (err, stat) => {
        if (err) {
            return res.status(404).send('File not found');
        }

        res.setHeader('Content-Type', stat.metaData['content-type']);
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Disposition', `attachment; filename="${path.basename(fileName)}"`);

        minioClient.getObject(bucketName, fileName, (err, dataStream) => {
            if (err) {
                return res.status(500).send('Error retrieving file');
            }

            dataStream.pipe(res);
        });
    });
});

// Handle listing files
app.get('/files', (req, res) => {
    const objectsList = [];
    const stream = minioClient.listObjects(bucketName, '', true);

    stream.on('data', obj => objectsList.push(obj));
    stream.on('error', err => res.status(500).send('Error retrieving file list'));
    stream.on('end', () => res.json(objectsList));
});

// Handle file delete
app.delete('/delete/:filename', (req, res) => {
    const fileName = req.params.filename;

    minioClient.removeObject(bucketName, fileName, (err) => {
        if (err) {
            return res.status(500).send('Error deleting file');
        }
        res.send('File deleted successfully');
    });
});

app.listen(port, () => {
    console.log(`Server is running on ${Url}`);
});