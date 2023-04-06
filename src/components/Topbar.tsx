import '../App.css';

function Topbar() {
    return (
        <div className="Topbar">
            <a href="https://github.com/MirkoMassa">Github</a>
            <a href="https://www.linkedin.com/in/mirko-massa">Linkedin</a>
            <a className="active" href="#home">Portfolio here! (WIP)</a>
        </div>
    );
}

export default Topbar;