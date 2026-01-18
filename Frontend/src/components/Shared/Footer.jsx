import { Facebook, Linkedin, Twitter } from "lucide-react"

const Footer = () => {
    return (
        <footer className="border-t border-t-gray-200 ">
            <div className="container flex justify-between items-center mx-auto px-4 py-2">
                <div className="  ">
                    <h2 className="text-xl font-bold">Job Hunt</h2>
                    <p>© 2024 Your Company.All rights reserved.</p>
                </div>
                <div>
                    <div className="flex items-center justify-center gap-6">
                        <a
                            href="https://facebook.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                            className="text-black hover:text-blue-600 transition-transform duration-300 hover:scale-110"
                        >
                            <Facebook className="w-6 h-6" />
                        </a>

                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Twitter"
                            className="text-black hover:text-sky-500 transition-transform duration-300 hover:scale-110"
                        >
                            <Twitter className="w-6 h-6" />
                        </a>

                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                            className="text-black hover:text-blue-700 transition-transform duration-300 hover:scale-110"
                        >
                            <Linkedin className="w-6 h-6" />
                        </a>
                    </div>
                </div>
            </div>

        </footer>
    )
}
export default Footer