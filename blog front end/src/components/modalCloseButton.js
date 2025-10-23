function ModalCloseButton({ text, className, handler }) {

  return (
    <button className={className} onClick={handler}>{text}</button>
  )
}
export default ModalCloseButton;
