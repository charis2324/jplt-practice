import Login from "../components/Login";
import backgroundImage from '../assets/jp-bg.jpeg';

function AuthPage() {
    return (<div className="w-screen h-screen bg-slate-50">
        <div style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}
            className="w-full h-full flex items-center justify-center p-4">
            <div className="flex flex-col p-6 sm:flex-row bg-white rounded-lg shadow-xl max-w-4xl w-full sm:py-8">
                <div className="sm:w-1/2 p-8 bg-white rounded-lg">
                    <h1 className="text-3xl font-bold mb-4">JLPT Practice</h1>
                    <p className="mb-4 text-pretty">Log in to access your personalized study dashboard and start mastering JLPT!</p>
                </div>
                <div className="sm:mx-auto">
                    <Login />
                </div>
            </div>
        </div>
    </div>)
}
export default AuthPage;