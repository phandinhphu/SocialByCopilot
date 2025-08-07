const Profile = ({ user }) => {
    return (
        <div className="profile">
            <h1>Tên: {user.name}</h1>
            <p>Tuổi: {user.age}</p>
            <p>Trường: {user.school}</p>
        </div>
    );
};

export default Profile;
