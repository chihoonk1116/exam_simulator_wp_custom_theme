export const showAlert = (message) => {
  document.getElementById('alert-container').classList.add('show')
  document.querySelector('.alert').classList.add('show')
  const alertDiv = document.querySelector('.alert')
  alertDiv.innerHTML = `<p> ${message} </p>`

  setTimeout(closeAlert, 3000)
}

export const closeAlert = () => {
  document.getElementById('alert-container').classList.remove('show')
  document.querySelector('.alert').classList.remove('show')
  const alertDiv = document.querySelector('.alert')
  alertDiv.innerHTML = ''
}

