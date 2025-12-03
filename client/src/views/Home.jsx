const Home = ({ login, me }) => {
    console.log(me)
    return (
        <>
            {login ? (
                <>
                    {me?.role === "user" && (
                        <h1>Home usuario</h1>
                    )}

                    {me?.role === "admin" && (
                        <h1>Home administrador</h1>
                    )}
                </>
            ) : (
                <h1>Home Invitado</h1>
            )}
        </>
    );
};

export default Home;
