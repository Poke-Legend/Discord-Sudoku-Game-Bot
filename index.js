const { Client, Intents, MessageEmbed } = require('discord.js');
const sudoku = require('sudoku');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

let currentPuzzle = null;
let currentSolution = null;

client.on('ready', () => {
    console.log(`Sudoku Game Loaded!`);
    console.log(`Logged in as ${client.user.tag}!`);
    console.log(`CODED BY DEVRY!`);
});

client.on('messageCreate', async message => {
    if (!message.guild) return; // Ignore DMs

    if (message.content === '!sudoku') {
        // Generate a new puzzle and solve it
        const puzzle = sudoku.makepuzzle();
        const solution = sudoku.solvepuzzle(puzzle);
        currentPuzzle = puzzle;
        currentSolution = solution.map(value => value + 1); // Adjust for human-readable format (1-9 instead of 0-8)

        // Display the puzzle in a user-friendly format
        const displayBoard = formatBoard(puzzle);
        const embed = new MessageEmbed()
            .setColor('#0099ff')
            .setTitle('Your Sudoku Puzzle')
            .setDescription(`\`\`\`${displayBoard}\`\`\``)
            .setFooter({ text: 'Type your answers in the format "row,col,num". Example: !answer 0,0,5' });

        await message.channel.send({ embeds: [embed] });
    } else if (message.content.startsWith('!answer ')) {
        // Parse the user's answer
        const params = message.content.slice(8).trim();
        const [row, col, num] = params.split(',').map(x => parseInt(x.trim()));

        // Validate the input
        if (!row && row !== 0 || !col && col !== 0 || !num) {
            await message.reply('Please make sure your answer is in the format "row,col,num". Example: !answer 0,0,5');
            return;
        }

        // Check the answer against the solution
        if (currentSolution && currentSolution[row * 9 + col] === num) {
            await message.reply('Correct!');
        } else {
            await message.reply('Wrong answer or invalid coordinates!');
        }
    } else if (message.content === '!solution') {
        // Send the complete solution
        if (currentSolution) {
            const solutionBoard = formatBoard(currentSolution);
            await message.channel.send(`Here's the solution:\n\`\`\`${solutionBoard}\`\`\``);
        } else {
            await message.reply('No active puzzle to show a solution for.');
        }
    }
});

function formatBoard(board) {
    return board.map((value, index) => {
        const num = value === null ? '.' : value;
        return `${num}${(index + 1) % 9 === 0 ? '\n' : ' '}`;
    }).join('');
}

client.login('Discord Bot Token');

