function ModalButton({ text, onClick, className }) {
  return <button onClick={onClick} className={className}>{text}</button>;
}
export default ModalButton;
