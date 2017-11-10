const parseComment = body => {
	const commandArray = body
		.split(/geoffbot\:\s?/)[1]
		.split("\n")[0]
		.split(/\s/g)
		.map(prop => ({ key: prop.split(/\:/)[0], val: prop.split(/\:/)[1] }));
	const commandMap = {};
	commandArray.forEach(cmd => (commandMap[cmd.key] = cmd.val));
	if (!commandMap.hasOwnProperty('domain')) {
		return false
	}
	return commandMap
};
const parseProp = action => action.split(".");
const domains = [
	{ id: "issue", subdomains: [] },
	{
		id: "project",
		subdomains: [
			{
				id: 'create',
				fn: (ctx,{name}) => ctx.github.projects.createRepoProject(context.repo({ name }))
			},
			{
				id: "card",
				actions: [
					{
						id: "move",
						fn: ctx => false
					}
				]
			}
		]
	},
	{ id: "pullrequest", subdomains: [] }
];

const getAction = cmdMap => {
	const [ cmdDomain, cmdDomainMember ] = parseProp(cmdMap.domain)
	const [ cmdSubdomain, cmdAction ] = parseProp(cmdMap.action)
	const domain = domains.filter(d => d.id === cmdDomain)
	const subdomain = domain.subdomains.filter(s => s.id === cmdSubdomain)
	const action = cmdAction ? subdomain.actions.filter(a => a.id === cmdAction) : subdomain
	return context => action.fn(context)
}

test = `geoffbot: domain:project action:create name:Roadmap2`

module.exports = robot => {
	console.log("Yay, the app was loaded!");
	robot.on("issue_comment.created", async context => {
		const { issue, comment } = context.payload;
		// : { html_url: issue_url, title, user: { login: openedBy } }
		// : { html_url: comment_url, user: { createdBy }, body }
		
		if (comment.body.search(/geoffbot\:\s/g) > -1) {
			const botCommands = parseComment(comment.body)
			const projects = await context.github.projects.getRepoProjects(context.repo())
			const projectDoesExist = projects.data.filter(p => p.name === newProject.name).length > 0 ? true : false

			if (!projectDoesExist) {
				//-> context.github.projects.createRepoProject(context.repo({ name: newProject.name }))
			}


		}
		// return context.github.projects.createRepoProject(context.repo({ name: 'Roadmap' }))
	});
	// For more information on building apps:
	// https://probot.github.io/docs/

	// To get your app running against GitHub, see:
	// https://probot.github.io/docs/development/
};
