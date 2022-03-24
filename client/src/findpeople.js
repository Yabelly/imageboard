import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function FindPeople() {
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState([]);
    console.log("searchterm outside: ", searchTerm);
    function handleChange(e) {
        setSearchTerm(e.target.value);
    }

    useEffect(() => {
        (async () => {
            if (!searchTerm) {
                const data = await fetch("/api/recentusers.json").then(
                    (resp) => {
                        return resp.json();
                    }
                );
                setUsers(data);
            } else {
                const data = await fetch(`/api/finduser/${searchTerm}`).then(
                    (resp) => {
                        return resp.json();
                    }
                );

                console.log(data);
                setUsers(data);
            }
        })();
    }, [searchTerm]);

    
    return (
        <section>
            <h3>Find other users!</h3>
            <input type="text" onChange={handleChange} />
            {!searchTerm && (
                <div>
                    <h5>Most recent people who joined the network</h5>
                </div>
            )}
            {searchTerm && (
                <div>
                    <h5>your search:</h5>
                </div>
            )}
            <div className="grid">
                {users.map((user) => (
                    <div key={user.id} className="profile">
                        <div className="username">
                            {user.first}&nbsp;
                            {user.last}
                        </div>
                        <Link to={`/user/${user.id}`}>
                            <div className="profile-image">
                                <img src={user.profile_pic}></img>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
}
