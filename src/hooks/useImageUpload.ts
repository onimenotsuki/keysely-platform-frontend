import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { user } = useAuth();

  const uploadImage = async (file: File): Promise<string | null> => {
    if (!user) {
      toast.error('Debes estar autenticado para subir imágenes');
      return null;
    }

    try {
      setUploading(true);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten archivos de imagen');
        return null;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no puede exceder 5MB');
        return null;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('space-images')
        .upload(fileName, file);

      if (error) {
        console.error('Error uploading image:', error);
        toast.error('Error al subir la imagen');
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('space-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Error inesperado al subir la imagen');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteImage = async (imagePath: string): Promise<boolean> => {
    if (!user) {
      toast.error('Debes estar autenticado para eliminar imágenes');
      return false;
    }

    try {
      // Extract the path from the full URL
      const urlParts = imagePath.split('/');
      const bucketPath = urlParts.slice(-2).join('/'); // Get user_id/filename.ext

      const { error } = await supabase.storage
        .from('space-images')
        .remove([bucketPath]);

      if (error) {
        console.error('Error deleting image:', error);
        toast.error('Error al eliminar la imagen');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Error inesperado al eliminar la imagen');
      return false;
    }
  };

  return {
    uploadImage,
    deleteImage,
    uploading
  };
};