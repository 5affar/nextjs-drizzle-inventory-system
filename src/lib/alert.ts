import Swal from 'sweetalert2';

export function showSuccessAlert(title: string, text?: string) {
  return Swal.fire({
    title,
    text,
    icon: 'success',
    confirmButtonText: 'OK',
  });
}

export function showErrorAlert(title: string, text?: string) {
  return Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'OK',
  });
}

export function showInfoAlert(title: string, text?: string) {
  return Swal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonText: 'OK',
  });
}

export function showWarningAlert(title: string, text?: string) {
  return Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonText: 'OK',
  });
}
