const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');

async function run() {
  try {
    const usuario = core.getInput('usuario', { required: true });
    const repo = core.getInput('repo', { required: true });
    const org_user = core.getInput('org_user', { required: true });
    const token = process.env.GITHUB_TOKEN;

    core.info(`Buscando commits de ${usuario} en ${org_user}/${repo}...`);
    const octokit = new Octokit({ auth: token });
    const response = await octokit.rest.repos.listCommits({
      owner: org_user,
      repo: repo,
      author: usuario,
      per_page: 100
    });

    const commits = response.data || [];
    core.info(`Se encontraron ${commits.length} commits.`);

    // Mostrar los primeros 5 commit
    commits.slice(0, 5).forEach((commit, idx) => {
      core.info(`${idx + 1}. ${commit.sha}: ${commit.commit.message}`);
    });

    core.setOutput('commits', JSON.stringify(commits));
    core.setOutput('count', commits.length);
  } catch (error) {
    core.setFailed(error.message);
  }
}

if (require.main === module) {
  run();
}
