# Dropzone App


A simple and efficient file upload and management application using SvelteKit and MinIO.

## Features

- Drag and drop file upload
- View and deselect selected files before upload
- File preview
- File download and delete functionality
- MinIO integration for storage


## Prerequisites


- Node.js
- MinIO


## Dependencies

- express
- Minio
- cors
- multer

## Installation
 ```bash
git clone https://github.com/UmangVarshney01/DropZone.git.
cd DropZone
```


## Install dependencies:

```bash
npm install
```

## Set up MinIO:

1. Install MinIO server if not already installed.
2. Open the command promt go where you download the minio.exe. 
3. Run command 'minio.exe server "path of the location where you want to store or get the bucket"'
4. Configure MinIO with access key and secret key.


## Configure environment variables:

- Go to the "//src//lib//properties//minioRequirements.js".
- Provide endPoint, port, accessKey, secretKey and bucketName.
- Go to the "//src//lib//properties//serverHost.js".
- Provide port and server name. 

## Run in development mode:
```bash
npm run dev
```
## Build for production

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
