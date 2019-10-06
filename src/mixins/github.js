export default {
  methods: {
    pullRequestUrl (repositoryName, pullRequestNumber) {
      return `https://github.com/${repositoryName}/pull/${pullRequestNumber}`
    },
    forkedBranchUrl (forkName, branchUrl) {
      return `https://github.com/${forkName}/tree/${branchUrl.split('/')[2]}`
    }
  }
}
