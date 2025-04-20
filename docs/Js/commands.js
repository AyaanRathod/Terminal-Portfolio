// Command descriptions
const commandDescriptions = {
    ls: "Lists contents of current directory",
    echo: "Prints text to the terminal",
    aboutme: "Displays information about me",
    github: "Opens my GitHub profile",
    resume: "Opens my resume/CV",
    projects: "Shows my portfolio projects",
    main: "Redirects to my main portfolio site",
    clear: "Clears the terminal screen",
    help: "Shows this help message" // Added help description here
};

// Directory data
const directories = {
    education: [
        '',
        '[[;white;]My Computer Science Courses:]',
        '',
        '• [[;yellow;]COSC 1P02] - Introduction to Computer Science',
        '• [[;yellow;]COSC 1P03] - Introduction to Data Structures',
        '• [[;yellow;]COSC 2P03] - Advanced Data Structures',
        '• [[;yellow;]COSC 3P94] - Human Computer Interaction',
        '• [[;yellow;]COSC 4P50] - Introduction to Cybersecurity',
        '• [[;yellow;]COSC 2P08] - Programming Big Data with Python',
        '• [[;yellow;]COSC 2P89] - Introduction to Web Development',
        ''
    ]
};

// Get directory names for completion/validation
const dirs = Object.keys(directories);

// Utility function needed by commands (like ls)
function print_home() {
    // Assumes 'term' is globally available or passed somehow
    // For simplicity, we'll rely on 'term' being global from my-terminal.js
    if (typeof term !== 'undefined') {
        term.echo(dirs.map(dir => {
            return `<blue class="directory">${dir}</blue>`;
        }).join('\n'));
    }
}

// Terminal commands implementation
// Note: These functions rely on 'term', 'cwd', 'root', 'dirs', 'directories', 'commandDescriptions'
// being accessible in their execution scope (likely global or passed via 'this' by terminal library).
const commands = {
    help() {
        term.echo("\n[[;white;]AVAILABLE COMMANDS:]\n");
        const cmds = Object.keys(commandDescriptions).sort();
        cmds.forEach(cmd => {
             term.echo(
                `  [[;yellow;]${cmd.padEnd(10)}] ${commandDescriptions[cmd]}`
            );
        });
        term.echo("\nType any command to execute it.\n");
    },

    cd(dir = null) {
        if (dir === null || dir === '~' || dir === '/') {
            cwd = root; // Modify global cwd
            return;
        }

        if (dir === '..') {
            if (cwd !== root) {
                cwd = root; // Modify global cwd
            }
            return;
        }

        if (dirs.includes(dir)) {
            cwd = root + '/' + dir; // Modify global cwd
        } else {
            this.error(`cd: ${dir}: No such directory`);
        }
    },

    aboutme() {
        this.echo(`
I'm a 3rd year Computer Science student passionate about:
• [[;white;]Web Development]
• [[;white;]Software Engineering]
• [[;white;]AI & Machine Learning]

In my free time, I enjoy reading books and working
on personal coding projects.

For more information, try:
[[;yellow;]github] - to check out my repositories
[[;yellow;]resume] - to view my full CV
[[;yellow;]cd education] - to see my courses
    `);
    },

    echo(...args) {
        if (args.length > 0) {
            this.echo(args.join(' '));
        }
    },

    github() {
        this.echo("Opening GitHub profile...");
        setTimeout(() => {
            window.open("https://github.com/AyaanRathod", "_blank");
        }, 200);
    },

    resume() {
        this.echo("Opening my resume...");
        setTimeout(() => {
            window.open("https://rxresu.me/ayaanrathod/ayaan-rathod-resume", "_blank");
        }, 300);
    },

    projects() {
        this.echo(`
<a href="https://github.com/AyaanRathod/Terminal-Portfolio" target="_blank">[[;orange;]🔗 Terminal Portfolio] [[;white;](Current website you're seeing)]</a>
A terminal-style portfolio website built with JavaScript
that simulates a command-line interface.
[[;cyan;]Technologies:] JavaScript, HTML, CSS, jQuery Terminal

<a href="https://ayaanrathod.github.io/Personal-Portfolio/" target="_blank">[[;orange;]🔗 Main Portfolio]</a>
My main portfolio website, showcasing my projects and skills.
[[;cyan;]Technologies:] HTML, CSS, JavaScript

<a href="#" target="_blank">[[;orange;]🔗 LinkedIn Ad Blocker]</a>
Developed a lightweight browser extension to block ads on LinkedIn,
enhancing user privacy and browsing experience.

[[;#44D544;]Highlights:]
• Created essential files (manifest.json, background.js, linkedin.js)
• Implemented background scripts for seamless ad blocking
• Contributed to open-source by sharing on GitHub

More projects coming soon...
                `);
    },

    main() {
        this.echo("Redirecting to the main portfolio...");
        setTimeout(() => {
            window.open("https://ayaanrathod.github.io/Personal-Portfolio/", "_blank");
        }, 300);
    },

    ls(dir = null) {
        // Use 'this.echo' and 'this.error' provided by jQuery Terminal
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                print_home(); // Assumes print_home is accessible
            } else if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const pathDirs = path.split('/');
                if (pathDirs.length > 1) {
                    this.error('[[;#ff5555;]Invalid directory path]');
                } else {
                    const targetDir = pathDirs[0];
                    if (targetDir in directories) {
                        this.echo(directories[targetDir].join('\n'));
                    } else {
                        this.error(`[[;#ff5555;]ls: cannot access '${dir}': No such directory]`);
                    }
                }
            } else if (cwd === root) { // Listing a directory from root
                 if (dir in directories) {
                    this.echo(directories[dir].join('\n'));
                } else {
                     this.error(`[[;#ff5555;]ls: cannot access '${dir}': No such directory]`);
                }
            } else if (dir === '..') { // ls .. from a subdirectory
                print_home();
            } else {
                 this.error(`[[;#ff5555;]ls: cannot access '${dir}': No such directory]`);
            }
        } else if (cwd === root) { // ls in root
            print_home();
        } else { // ls in a subdirectory
            const currentDir = cwd.substring(root.length + 1); // Get 'education' from '~/education'
            if (currentDir in directories) {
                this.echo(directories[currentDir].join('\n'));
            } else {
                // Should not happen if cd works correctly, but good to handle
                 this.error('[[;#ff5555;]Error: Current directory not found]');
                 cwd = root; // Reset cwd if state is invalid
            }
        }
    },

    clear() {
        this.clear();
        // Re-display the welcome message after clearing
        // Assumes 'ready' function is globally accessible from my-terminal.js
        if (typeof ready === 'function') {
             ready(); // Call ready directly if it's global
        } else if (typeof term !== 'undefined' && typeof term.ready === 'function') {
             term.ready(); // Or if it's attached to term
        }
         // Note: The original 'ready' function in my-terminal.js needs to be accessible
         // or its logic duplicated/refactored here. For simplicity, assume it's made global.
    }
};

// Make command_list global for the formatter in my-terminal.js
const command_list = Object.keys(commands);
