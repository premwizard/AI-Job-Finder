'use client';

import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Trash2, Upload } from 'lucide-react';
import { useUploadAvatar, useDeleteAvatar } from '../../hooks/usePersonalInfo';
import { toast } from 'sonner';

interface AvatarUploaderProps {
  url?: string;
  name: string;
}

export function AvatarUploader({ url, name }: AvatarUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const { mutate: deleteAvatar, isPending: isDeleting } = useDeleteAvatar();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    uploadAvatar(file, {
      onSuccess: () => {
        toast.success('Profile picture updated successfully');
        setPreview(null); // Clear local preview, use server URL
      },
      onError: () => {
        toast.error('Failed to update profile picture');
        setPreview(null);
      },
    });
  };

  const handleDelete = () => {
    deleteAvatar(undefined, {
      onSuccess: () => toast.success('Profile picture removed'),
      onError: () => toast.error('Failed to remove profile picture'),
    });
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const displayUrl = preview || url;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative group">
        <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
          <AvatarImage src={displayUrl} className="object-cover" />
          <AvatarFallback className="text-2xl font-medium bg-primary/10 text-primary">
            {initials || 'User'}
          </AvatarFallback>
        </Avatar>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
          disabled={isUploading || isDeleting}
        >
          <Camera className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <h4 className="font-semibold text-sm">Profile Picture</h4>
        <p className="text-xs text-muted-foreground">
          Supported formats: PNG, JPG, JPEG, WEBP. Max size: 5MB.
        </p>
        <div className="flex items-center gap-3 mt-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isDeleting}
          >
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </Button>
          {url && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              onClick={handleDelete}
              disabled={isUploading || isDeleting}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              {isDeleting ? 'Removing...' : 'Remove'}
            </Button>
          )}
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/png, image/jpeg, image/jpg, image/webp"
        className="hidden"
      />
    </div>
  );
}
