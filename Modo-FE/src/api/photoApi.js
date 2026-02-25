import api from './api';

function extractFile(input) {
  if (typeof File !== 'undefined' && input instanceof File) {
    return input;
  }
  if (input && typeof File !== 'undefined' && input.file instanceof File) {
    return input.file;
  }
  return null;
}

function buildFormData(file) {
  const formData = new FormData();
  formData.append('photo', file);
  return formData;
}

export function preparePhotoUpload(file) {
  const validFile = extractFile(file);
  if (!validFile) {
    throw new Error('유효한 이미지 파일이 아닙니다.');
  }
  if (typeof validFile.type === 'string' && !validFile.type.startsWith('image/')) {
    throw new Error('이미지 파일만 업로드할 수 있습니다.');
  }
  return {
    file: validFile,
    previewUrl: typeof URL !== 'undefined' ? URL.createObjectURL(validFile) : null,
  };
}

export function revokePhotoPreview(previewUrl) {
  if (!previewUrl || typeof URL === 'undefined') return;
  URL.revokeObjectURL(previewUrl);
}

export function uploadTodoPhotoFile(uploadPayload) {
  const file = extractFile(uploadPayload);
  if (!file) {
    throw new Error('업로드할 이미지 파일이 없습니다.');
  }
  return {
    file,
    formData: buildFormData(file),
  };
}

export async function submitTodoPhotoProof(todoId, uploadedPhoto) {
  const { formData } = uploadTodoPhotoFile(uploadedPhoto);
  const response = await api.post(`/api/todos/${todoId}/photo-proof`, formData, {
    headers: {
      'Content-Type': undefined,
    },
  });
  return response?.data?.data || response?.data;
}

export async function uploadPhotoForGuildProof(uploadedPhoto) {
  uploadTodoPhotoFile(uploadedPhoto);

  throw new Error(
    "길드 사진 인증용 업로드 API가 필요합니다. file -> photoUrl를 반환하는 endpoint를 백엔드에 추가해주세요."
  );
}