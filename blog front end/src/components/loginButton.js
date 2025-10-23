import style from "../styles/loginButton.module.css";
function LoginButton({handler, text}) {
  return (
    <>
      <div>
        <div>
          <button className={style.loginButton} onClick={handler}>
            {text}
          </button>
        </div>
      </div>
    </>
  );
}
export default LoginButton;
