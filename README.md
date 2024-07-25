# DropZone App


A simple and efficient file upload and management application using SvelteKit and MinIO.

## Features

```bash
# Drag and drop file upload
# View and deselect selected files before upload
# File preview
# File download and delete functionality
# MinIO integration for storage
```

## Prerequisites

```bash
# Node.js
# MinIO
```

## Dependencies

```bash
# express
# Minio
# cors
# multer
```
## Installation
```bash
# Unzip the DropZone file.
# Open DropZone folder in the IDE like:VSCode
```

## Install dependencies:
```bash
npm install
```

## Set up MinIO:
```bash
# Install MinIO server if not already installed.
# Open the command promt go where you download the minio.exe. 
# Run command 'minio.exe server "path of the location where you want to store or get the bucket"'
# Configure MinIO with access key and secret key.
```

## Configure environment variables:
```bash
# Go to the "//src//lib//properties//minioRequirements.js".
# Provide endPoint, port, accessKey, secretKey and bucketName.

# You can also provide port for sever by visiting "//src//lib//properties//serverHost.js".
```

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
