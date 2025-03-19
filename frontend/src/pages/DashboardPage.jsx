import { motion } from "framer-motion";
import { userAuthStore } from "../../store/auth.store";
const DashboardPage = () => {
    const {user,logout}  = userAuthStore();

    const logoutHendler = () => {
        logout();
    }

    return <>
    <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity:0, scale: 0.9 }}
            transition={{duration : 0.5}}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden'
        >
            <div>
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
			overflow-hidden'
        >
            <h3>Account activity</h3>
            <p>
            <span>join:  </span>
            {/* {
                new Date(user.createAt()).toLocaleDateString("en-us",{
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                })
            } */}
            </p>

            <p>
                <span>Last Login: </span>
                {/* {user.lastLogin} */}
            </p>
        </motion.div>

        <button onClick={logoutHendler}>logout</button>
            </div>
        </motion.div>
    </>
}

export default DashboardPage;