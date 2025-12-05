export async function login(username: string, password: string) {
  const response = await fetch("http://localhost:8080/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  return await response.json();
}
export async function register(
  email: string,
  username: string,
  password: string
) {
  const response = await fetch("http://localhost:8080/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, username, password }),
  });
  return await response.json();
}
export async function getProfile() {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:8080/auth/userdetail", {
    method: "GET",

    headers: {
      Authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}
