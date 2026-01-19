export default function ResumeForm() {
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <form className="w-full">
                <div className="flex">
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" placeholder="Enter your full name" />
                </div>
                <label htmlFor="email">Email</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" />
            </form >
        </div >
    );
}