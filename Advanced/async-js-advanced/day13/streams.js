/*
 * Day 13: Streams & Blob Handling
 * Topics covered:
 * 1. ReadableStream
 * 2. WritableStream
 * 3. TransformStream
 * 4. Blob and File handling
 * 5. Real-world Examples
 */

// 1. ReadableStream Examples

// Create a simple readable stream
function createNumberStream(start = 0, end = 10) {
    return new ReadableStream({
        start(controller) {
            this.current = start;
            this.end = end;
        },
        pull(controller) {
            if (this.current <= this.end) {
                controller.enqueue(this.current++);
            } else {
                controller.close();
            }
        }
    });
}

// Create a stream from array chunks
function createArrayStream(array, chunkSize = 1) {
    let position = 0;
    
    return new ReadableStream({
        pull(controller) {
            if (position >= array.length) {
                controller.close();
                return;
            }
            
            const chunk = array.slice(position, position + chunkSize);
            position += chunkSize;
            controller.enqueue(chunk);
        }
    });
}

// 2. WritableStream Examples

// Create a writable stream that collects data
function createCollectorStream() {
    const chunks = [];
    
    return new WritableStream({
        write(chunk) {
            chunks.push(chunk);
            console.log('Received chunk:', chunk);
        },
        close() {
            console.log('Final result:', chunks);
        }
    });
}

// Create a writable stream that processes data
function createProcessingStream(processor) {
    return new WritableStream({
        write(chunk) {
            const result = processor(chunk);
            console.log('Processed chunk:', result);
        },
        close() {
            console.log('Processing complete');
        }
    });
}

// 3. TransformStream Examples

// Create a transform stream that doubles numbers
const doubleTransformer = new TransformStream({
    transform(chunk, controller) {
        controller.enqueue(chunk * 2);
    }
});

// Create a transform stream that filters data
function createFilterStream(predicate) {
    return new TransformStream({
        transform(chunk, controller) {
            if (predicate(chunk)) {
                controller.enqueue(chunk);
            }
        }
    });
}

// Create a transform stream that batches items
function createBatchStream(size) {
    let batch = [];
    
    return new TransformStream({
        transform(chunk, controller) {
            batch.push(chunk);
            
            if (batch.length >= size) {
                controller.enqueue(batch);
                batch = [];
            }
        },
        flush(controller) {
            if (batch.length > 0) {
                controller.enqueue(batch);
            }
        }
    });
}

// 4. Blob and File Handling

// Create a stream from a blob
async function streamBlob(blob) {
    const stream = blob.stream();
    const reader = stream.getReader();
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        console.log('Chunk:', value);
    }
}

// Convert stream to blob
async function streamToBlob(stream, mimeType = 'application/octet-stream') {
    const chunks = [];
    const reader = stream.getReader();
    
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }
    
    return new Blob(chunks, { type: mimeType });
}

// Process file in chunks
async function processLargeFile(file, chunkSize = 1024 * 1024) {
    const stream = file.stream();
    const reader = stream.getReader();
    let processedSize = 0;
    
    while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        processedSize += value.length;
        const progress = (processedSize / file.size) * 100;
        
        console.log(`Progress: ${progress.toFixed(2)}%`);
        await processChunk(value);
    }
}

// 5. Real-world Examples

// Example 1: File Upload with Progress
class FileUploader {
    constructor(url) {
        this.url = url;
    }
    
    async upload(file, onProgress) {
        const stream = file.stream();
        const reader = stream.getReader();
        let uploadedSize = 0;
        
        // Create array buffer from stream
        const chunks = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            chunks.push(value);
            uploadedSize += value.length;
            onProgress(uploadedSize / file.size);
        }
        
        const blob = new Blob(chunks, { type: file.type });
        
        // Upload the blob
        const response = await fetch(this.url, {
            method: 'POST',
            body: blob
        });
        
        return response.json();
    }
}

// Example 2: Video Stream Processing
class VideoProcessor {
    constructor() {
        this.transformer = new TransformStream({
            transform: async (frame, controller) => {
                const processedFrame = await this.processVideoFrame(frame);
                controller.enqueue(processedFrame);
            }
        });
    }
    
    async processVideoFrame(frame) {
        // Simulate frame processing
        return frame;
    }
    
    async process(videoBlob) {
        const mediaStream = await this.createMediaStream(videoBlob);
        const videoTrack = mediaStream.getVideoTracks()[0];
        
        const mediaProcessor = new MediaStreamTrackProcessor({ track: videoTrack });
        const mediaGenerator = new MediaStreamTrackGenerator({ kind: 'video' });
        
        mediaProcessor.readable
            .pipeThrough(this.transformer)
            .pipeTo(mediaGenerator.writable);
        
        return new MediaStream([mediaGenerator]);
    }
    
    async createMediaStream(videoBlob) {
        const video = document.createElement('video');
        video.src = URL.createObjectURL(videoBlob);
        await video.play();
        return video.captureStream();
    }
}

// Example 3: Data Compression Stream
class CompressionStream {
    constructor() {
        this.compressor = new TransformStream({
            transform: async (chunk, controller) => {
                const compressed = await this.compress(chunk);
                controller.enqueue(compressed);
            }
        });
    }
    
    async compress(data) {
        // Simulate compression
        return data;
    }
    
    async processStream(inputStream) {
        return inputStream.pipeThrough(this.compressor);
    }
}

// Helper functions
async function processChunk(chunk) {
    // Simulate chunk processing
    await new Promise(resolve => setTimeout(resolve, 100));
}

// Example usage
async function runExamples() {
    // Test number stream
    const numberStream = createNumberStream(1, 5);
    const numberReader = numberStream.getReader();
    
    while (true) {
        const { done, value } = await numberReader.read();
        if (done) break;
        console.log('Number:', value);
    }
    
    // Test array stream with transformation
    const array = [1, 2, 3, 4, 5];
    const arrayStream = createArrayStream(array, 2)
        .pipeThrough(doubleTransformer)
        .pipeThrough(createBatchStream(2));
    
    const collector = createCollectorStream();
    await arrayStream.pipeTo(collector);
    
    // Test file processing
    const file = new File(['Hello, World!'], 'test.txt', { type: 'text/plain' });
    await processLargeFile(file, 5);
}

// Uncomment to run examples
// runExamples(); 