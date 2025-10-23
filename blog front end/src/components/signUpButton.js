import style from "../styles/signupButton.module.css";
function SignUpButton({handler, text}) {
  return (
    <>
      <div>
        <button className={style.signUpButton} onClick={handler}>
          {text}
        </button>
      </div>
    </>
  );
}
export default SignUpButton;
