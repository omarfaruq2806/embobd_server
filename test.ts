async function testNoOrigin() {
  const res = await fetch("http://localhost:5000/api/auth/sign-in/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: "tanvir_1788264229554@example.com",
      password: "password123456",
    }),
  });

  const data = await res.json();
  console.log("Response without Origin Header:", data);
}

testNoOrigin().catch(console.error);