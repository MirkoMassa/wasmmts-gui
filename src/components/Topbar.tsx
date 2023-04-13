import '../App.css';

function Topbar() {
    return (
        <div className="Topbar">
            <img src={require("../images/logo.png")} alt="logo"/>
                <a href="https://github.com/MirkoMassa">
                    <div id="git"></div>
                </a>
                <a href="https://www.linkedin.com/in/mirko-massa">
                    <div id="linkedin"></div>
                </a>
            <a className="active" href="home">Portfolio here! (WIP)</a>
        </div>
        
    );
}

export default Topbar;