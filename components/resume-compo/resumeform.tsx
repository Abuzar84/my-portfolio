export default function ResumeForm() {
    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <form className="flex flex-wrap w-[50vw] h-[50vh]">
                <label htmlFor="name">Name</label>&ensp;
                <input type="text" id="name" name="name" placeholder="Enter your full name" />
                <label htmlFor="email">Email</label>&ensp;
                <input type="email" id="email" name="email" placeholder="Enter your email" />
                <label htmlFor="phone">Phone</label>&ensp;
                <input type="text" id="phone" name="phone" placeholder="Enter your phone number" />
                <label htmlFor="address">Address</label>&ensp;
                <input type="text" id="address" name="address" placeholder="Enter your address" />
                <label htmlFor="summary">Summary</label>&ensp;
                <input type="text" id="summary" name="summary" placeholder="Enter your summary" />
                <label htmlFor="experience">Experience</label>&ensp;
                <input type="text" id="experience" name="experience" placeholder="Enter your experience" />
                <label htmlFor="education">Education</label>&ensp;
                <input type="text" id="education" name="education" placeholder="Enter your education" />
                <label htmlFor="skills">Skills</label>&ensp;
                <input type="text" id="skills" name="skills" placeholder="Enter your skills" />
            </form>
        </div >
    );
}