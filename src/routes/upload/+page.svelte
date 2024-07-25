<svelte:head>
    <title>Upload</title>
  </svelte:head>

<script>
    import { onMount } from 'svelte';
    import upload from '$lib/images/upload.png';
    import { serverURL } from '$lib/properties/serverHost.js';

    let selectedFiles = [];

    function handleFileSelect(event) {
        selectedFiles = Array.from(event.target.files);
    }

    function handleDrop(event) {
        event.preventDefault();
        event.stopPropagation();
        selectedFiles = Array.from(event.dataTransfer.files);
    }

    function handleDragOver(event) {
        event.preventDefault();
        event.stopPropagation();
    }

    function deselectFile(index) {
        selectedFiles.splice(index, 1);
        selectedFiles = [...selectedFiles];
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (selectedFiles.length === 0) {
            alert('Please select at least one file.');
            return;
        }

        const formData = new FormData();
        for (const file of selectedFiles) {
            formData.append('files', file);
        }

        try {
            const response = await fetch(`${serverURL}/upload`, {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const message = await response.text();
                document.getElementById('message').textContent = message;
                selectedFiles = []; // Clear selected files after upload
            } else {
                document.getElementById('message').textContent = 'File upload failed';
            }
        } catch (error) {
            console.error('Error uploading files:', error);
            document.getElementById('message').textContent = 'Error uploading files';
        }
    }

    onMount(() => {
        const dropZone = document.getElementById('dropZone');
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleDrop);
    });
</script>

<div class="container">
    <h1>Upload Multiple Files</h1>
    <form on:submit={handleSubmit}>
        <input type="file" id="fileInput" name="files" multiple on:change={handleFileSelect}>
        <div id="dropZone" class="drop-zone" on:click={() => document.getElementById('fileInput').click()}>
            <label for="upload" class="uploader">
                <img src={upload} alt="upload">
                <h3  >Drag & Drop files here or click to select files</h3>
              </label>
        </div>
        <div class="button-container">
            <button type="submit">Upload Files</button>
        </div>
    </form>

    <div id="selectedFiles">
        <h1>Selected Files</h1>
        <ul id="selectedFilesList">
            {#each selectedFiles as file, index}
                <li class="selected-file-item">
                    <div class="file-extension">{file.name.split('.').pop()}</div>
                    <span class="file-name">{file.name}</span>
                    <button class="deselect-button" on:click={() => deselectFile(index)}>
                        <i class="fas fa-times"></i>
                    </button>
                </li>
            {/each}
        </ul>
    </div>
    
    <div id="message"></div>
</div>

<style>

</style>


