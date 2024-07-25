<svelte:head>
    <title>View</title>
  </svelte:head>

<script>
    import { onMount } from 'svelte';
    import { serverURL } from '$lib/properties/serverHost.js';

    let fileList = [];

    async function fetchFileList() {
        try {
            const response = await fetch(`${serverURL}/files`);
            fileList = await response.json();
        } catch (error) {
            console.error('Error fetching file list:', error);
        }
    }

    async function handleFileDownload(fileName) {
        try {
            const response = await fetch(`${serverURL}/download/${encodeURIComponent(fileName)}`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            } else {
                alert('File download failed');
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    }

    async function handleFileDelete(fileName) {
        if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
            return;
        }

        try {
            const response = await fetch(`${serverURL}/delete/${encodeURIComponent(fileName)}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('File deleted successfully.');
                fetchFileList(); // Refresh file list after deletion
            } else {
                alert('File delete failed');
            }
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    }

    function getFileExtension(fileName) {
        return fileName.split('.').pop();
    }

    onMount(() => {
        fetchFileList();
    });
</script>

<div class="container">
    <h1>Stored Files</h1>
    <div class="file-list">
        {#each fileList as file}
            <div class="file-item">
                <div class="file-extension">{getFileExtension(file.name)}</div>
                <span class="file-name">{file.name}</span>
                <div class="file-item-buttons">
                    <button class="download-button" on:click={() => handleFileDownload(file.name)}>
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="delete-button" on:click={() => handleFileDelete(file.name)}>
                        <i class="fas fa-trash-alt "></i>
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>

<style>

</style>
