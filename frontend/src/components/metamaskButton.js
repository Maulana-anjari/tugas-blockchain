export default function MetaMaskButton({ task }) {
    return (
        <div className="mt-10 flex items-center justify-center gap-x-6">
            <button
                onClick={task}
                className="rounded-md bg-amber-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xl hover:bg-amber-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
                (0) Connect to MetaMask
            </button>
        </div>
    )
}