const userForm = document.getElementById("userForm");
const userInfoContainer = document.getElementById("userInfo");
const issuesContainer = document.getElementById("issuesContainer"); // Added for displaying issues

userForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value;
  try {
    const userData = await getUserData(username);
    displayUserInfo(userData);
    userForm.reset();

    // Search and Add Functionality
    searchAndAddUser("anotherUsername");

    // Fetch and display issues for the new user
    await fetchIssuesForUser("anotherUsername");

    // Dig into a specific issue
    await fetchAndDisplaySpecificIssue();
  } catch (error) {
    console.error(error.message);
  }
});

async function getUserData(username) {
  const response = await fetch(`https://api.github.com/users/${username}`);
  const userData = await response.json();
  return userData;
}

function displayUserInfo(userData) {
  userInfoContainer.innerHTML += `
        <h2>${userData.name}</h2>
        <img src="${userData.avatar_url}" alt="User Avatar">
        <p>${userData.bio}</p>
        <p>Followers: ${userData.followers}</p>
        <p>Following: ${userData.following}</p>
        <p>Public Repos: ${userData.public_repos}</p>
    `;

  userInfoContainer.style.display = "block";
}

// Search and Add Functionality
async function searchAndAddUser(anotherUsername) {
  try {
    const userData = await getUserData(anotherUsername);
    displayUserInfo(userData);
  } catch (error) {
    console.error(error.message);
  }
}

// Function to fetch and display issues for a user
async function fetchIssuesForUser(username) {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos`
    );
    const repositories = await response.json();

    for (const repo of repositories) {
      const issuesResponse = await fetch(`${repo.url}/issues`);
      const issuesData = await issuesResponse.json();
      displayIssues(issuesData);
    }
  } catch (error) {
    console.error(error.message);
  }
}

async function fetchAndDisplaySpecificIssue() {
  try {
    const specificIssueUrl =
      "https://api.github.com/repos/facebook/create-react-app/issues/13364";
    const response = await fetch(specificIssueUrl);
    const specificIssueData = await response.json();
    displaySpecificIssue(specificIssueData);
  } catch (error) {
    console.error(error.message);
  }
}

function displayIssues(issuesData) {
  issuesContainer.innerHTML = ""; // Clear existing content

  issuesData.forEach((issue) => {
    const issueElement = document.createElement("div");
    issueElement.classList.add("issue");

    issueElement.innerHTML = `
        <h3>${issue.title}</h3>
        <p>${issue.body}</p>
        <p>Author: <a href="${issue.user.html_url}" target="_blank">${issue.user.login}</a></p>
        <hr>
    `;

    issuesContainer.appendChild(issueElement);
  });
}

function displaySpecificIssue(specificIssueData) {
  issuesContainer.innerHTML = ""; // Clear existing content

  const issueElement = document.createElement("div");
  issueElement.classList.add("issue");

  issueElement.innerHTML = `
      <h3>${specificIssueData.title}</h3>
      <p>${specificIssueData.body}</p>
      <p>Author: <a href="${specificIssueData.user.html_url}" target="_blank">${specificIssueData.user.login}</a></p>
      <hr>
  `;

  issuesContainer.appendChild(issueElement);
}
