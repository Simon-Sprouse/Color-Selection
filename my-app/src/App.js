import './App.css';
import GradientUI from './GradientUI';



function App() {

    const width = 800;
    const defaultHsv = {h: 20, s:90, v:80};

    return (
        <>
            <GradientUI width={width} defaultHsv={defaultHsv} />
        </>
    )
   
}

export default App;
