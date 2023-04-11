import '../App.css';

function Topbar() {
    return (
        <div className="Topbar">
            <img src={require("../images/logo.png")} alt="logo"/>
            <a href="https://github.com/MirkoMassa">
                <img id="git" src={require("../images/git.png")} alt="github" />
            </a>
            <a href="https://www.linkedin.com/in/mirko-massa">
                <img id="lnkin" src={require("../images/lnkin.png")} alt="linkedin" />
            </a>
            <a className="active" href="#home">Portfolio here! (WIP)</a>
        </div>
        
    );
}

export default Topbar;