import { useState, useEffect } from "react";

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
                console.log("result from fetch: ", data);
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
            <div>Your searchterm: {searchTerm}</div>
            {users.map((user) => (
                <div key={user.id}>{user.first}{user.last}</div>
            ))}
        </section>
    );
}
