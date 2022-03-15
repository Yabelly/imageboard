export function ProfilePic({ url, firstName, lastName, showUploader }) {
    return (
        <div className="profile-pic" onClick={showUploader}>
            <img
                alt={`${firstName} ${lastName}`}
                src={url || "/images/defaultprofile.jpeg"}
            />
        </div>
    );
}
