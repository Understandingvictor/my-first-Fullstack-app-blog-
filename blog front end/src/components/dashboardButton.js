import style from "../styles/dashboard.module.css"
function DashboardButton({image, handler}){
    return(
        <>
        <button className={style.btn} onClick={handler}>{image}</button>
        
        </>
    )
}
export default DashboardButton;