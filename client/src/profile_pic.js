export function ProfilePic({
    url = "./images/defaultprofile.jpeg",
    firstName,
    lastName,
    showUploader,
}) {
    return (
        <div id={"profile-pic"} onClick={showUploader}>
            <img alt={`${firstName} ${lastName}`} src={url} />
        </div>
    );
}
