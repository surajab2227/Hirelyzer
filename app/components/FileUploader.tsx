// app/components/FileUploader.tsx

import { useState, useCallback, useRef } from 'react'; // Import useRef
import { useDropzone } from 'react-dropzone';
import { formatSize } from '../lib/utils';
import { gsap } from 'gsap'; // Import GSAP
import { useGSAP } from '@gsap/react'; // Import useGSAP hook

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect]);

    const maxFileSize = 20 * 1024 * 1024; // 20MB in bytes

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    });

    const file = acceptedFiles[0] || null;

    // Refs for the elements we want to animate
    const dropzoneContainerRef = useRef(null);
    const dropzoneContentRef = useRef(null);
    const selectedFileRef = useRef(null); // Ref for the selected file display
    const infoIconRef = useRef(null); // Ref for the info icon
    const textRef = useRef(null); // Ref for the descriptive text

    // GSAP Animation Logic
    useGSAP(() => {
        // Initial entrance animation for the drop zone
        gsap.fromTo(
            dropzoneContainerRef.current,
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: "power3.out" }
        );

        // Drag-and-drop active state animation
        // This will run whenever isDragActive changes
        if (isDragActive) {
            gsap.to(dropzoneContainerRef.current, {
                scale: 1.02,
                boxShadow: '0 0 25px rgba(138, 43, 226, 0.5)', // Subtle glow
                borderColor: '#8A2BE2', // Highlight border
                duration: 0.3,
                ease: "power2.out",
            });
            gsap.to(infoIconRef.current, {
                scale: 1.2, // Make icon larger on drag
                duration: 0.3,
                ease: "power2.out"
            });
        } else {
            // Revert when not active
            gsap.to(dropzoneContainerRef.current, {
                scale: 1,
                boxShadow: 'none',
                borderColor: 'initial', // Or your default border color
                duration: 0.3,
                ease: "power2.out",
            });
            gsap.to(infoIconRef.current, {
                scale: 1, // Reset icon size
                duration: 0.3,
                ease: "power2.out"
            });
        }
    }, [isDragActive]); // Dependency array: run when isDragActive changes

    // Animation for file selection/deselection
    useGSAP(() => {
        if (file) {
            // If a file is selected, animate its entry
            gsap.fromTo(
                selectedFileRef.current,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" }
            );
        } else {
            // If no file, animate the default prompt fading in
            gsap.fromTo(
                dropzoneContentRef.current,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
        }
    }, [file]); // Dependency array: run when 'file' changes


    return (
        <div className="w-full gradient-border" ref={dropzoneContainerRef}> {/* Add ref here */}
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                {/* Conditional rendering based on whether a file is selected */}
                {file ? (
                    <div className="space-y-4 cursor-pointer" ref={selectedFileRef}> {/* Add ref for selected file display */}
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <img src="/images/pdf.png" alt="pdf" className="size-10" />
                            <div className="flex items-center space-x-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                                        {file.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button className="p-2 cursor-pointer" onClick={(e) => {
                                e.stopPropagation(); // Prevent dropzone click when removing file
                                gsap.to(selectedFileRef.current, {
                                    opacity: 0, x: 20, duration: 0.3, onComplete: () => onFileSelect?.(null)
                                });
                            }}>
                                <img src="/icons/cross.svg" alt="remove" className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 cursor-pointer" ref={dropzoneContentRef}> {/* Add ref for initial content */}
                        <div>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img src="/icons/info.svg" alt="upload" className="size-20" ref={infoIconRef} /> {/* Add ref */}
                            </div>
                            <p className="text-lg text-gray-500" ref={textRef}> {/* Add ref */}
                                <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-lg text-gray-500">PDF (max {formatSize(maxFileSize)})</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUploader;