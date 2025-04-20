// Constants and Global Variables
const root = '~';
let cwd = root;
const user = 'guest';
const server = 'AyaanRathod';
const font = 'slant';
// Add mobile detection
let isMobile = window.innerWidth <= 768;
let isKeyboardOpen = false;

const commandDescriptions = {
    ls: "Lists contents of current directory",
    echo: "Prints text to the terminal",
    aboutme: "Displays information about me",
    github: "Opens my GitHub profile",
    resume: "Opens my resume/CV",
    projects: "Shows my portfolio projects",
    main: "Redirects to my main portfolio site",
    clear: "Clears the terminal screen"
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

// Utility functions
function print_home() {
    term.echo(dirs.map(dir => {
        return `<blue class="directory">${dir}</blue>`;
    }).join('\n'));
}

function prompt() {
    return `<green>${user}<white>@</white><magenta>${server}</magenta></green>:<blue>${cwd}</blue>$ `;
}

function rand(max) {
    return Math.floor(Math.random() * (max + 1));
}

function trim(str) {
    return str.replace(/[\n\s]+$/, '');
}

function render(text) {
    const cols = term.cols();
    return trim(figlet.textSync(text, {
        font: font,
        width: cols,
        whitespaceBreak: true
    }));
}

function ready() {
    // Use the same rendering function for both mobile and desktop
    term.echo(() => (render('Ayaan Rathod')))
       .echo('[[;cyan;]\nWelcome to my' + (isMobile ? '' : ' Interactive') + ' Terminal Portfolio!]')
       .echo('');
       
    if (isMobile) {
        // Shorter instructions for mobile to save screen space
        term.echo('[[;#44D544;]→] Type [[;yellow;]help] for commands')
            .echo('[[;#44D544;]→] Try [[;yellow;]aboutme] to learn about me')
            .echo('')
            .resume();
    } else {
        // Full instructions for desktop
        term.echo('[[;#44D544;]→] Type [[;yellow;]help] to see all available commands')
           .echo('[[;#44D544;]→] Try [[;yellow;]aboutme] to learn about my background')
           .echo('[[;#44D544;]→] Check out [[;yellow;]projects] to see what I\'ve built')
           .echo('[[;#44D544;]→] Use [[;yellow;]cd education] to view my academic courses')
           .echo('[[;#44D544;]→] Use [[;yellow;]main] to visit my main portfolio site')
           .echo('')
           .echo('[[;white;]Navigate like you would in a real terminal - have fun exploring!]\n')
           .resume();
    }
}

// Terminal commands
const commands = {
    help() {
        term.echo("\n[[;white;]AVAILABLE COMMANDS:]\n");
        
        for (const cmd in commandDescriptions) {
            term.echo(
                `  [[;yellow;]${cmd.padEnd(10)}] ${commandDescriptions[cmd]}`
            );
        }
        term.echo("\nType any command to execute it.\n");
    },

    cd(dir = null) {
        if (dir === null || dir === '~' || dir === '/') {
            cwd = root;
            return;
        } 
        
        if (dir === '..') {
            if (cwd !== root) {
                cwd = root;
            }
            return;
        }
        
        if (dirs.includes(dir)) {
            cwd = root + '/' + dir;
        } else {
            term.echo(`cd: ${dir}: No such directory`);
        }
    },

    aboutme() {
        term.echo(`
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
            term.echo(args.join(' '));
        }
    },
    
    github() {
        term.echo("Opening GitHub profile...");
        setTimeout(() => {
            window.open("https://github.com/AyaanRathod", "_blank");
        }, 200);
    },

    resume() {
        term.echo("Opening my resume...");
        setTimeout(() => {
            window.open("https://rxresu.me/ayaanrathod/ayaan-rathod-resume", "_blank");
        }, 300);
    },

    projects() {
        term.echo(`
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
        term.echo("Redirecting to the main portfolio...");
        setTimeout(() => {
            window.open("https://ayaanrathod.github.io/Personal-Portfolio/", "_blank");
        }, 300);
    },

    ls(dir = null) {
        if (dir) {
            if (dir.match(/^~\/?$/)) {
                print_home();
            } else if (dir.startsWith('~/')) {
                const path = dir.substring(2);
                const dirs = path.split('/');
                if (dirs.length > 1) {
                    term.echo('[[;#ff5555;]Invalid directory]');
                } else {
                    const dir = dirs[0];
                    if (dir in directories) {
                        term.echo(directories[dir].join('\n'));
                    } else {
                        term.echo('[[;#ff5555;]Invalid directory]');
                    }
                }
            } else if (cwd === root) {
                if (dir in directories) {
                    term.echo(directories[dir].join('\n'));
                } else {
                    term.echo('[[;#ff5555;]Invalid directory]');
                }
            } else if (dir === '..') {
                print_home();
            } else {
                term.echo('[[;#ff5555;]Invalid directory]');
            }
        } else if (cwd === root) {
            print_home();
        } else {
            const dir = cwd.substring(2);
            term.echo(directories[dir].join('\n'));
        }
    },
    
    clear() {
        term.clear();
        ready();
    }
};

// Help formatter
const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});

const command_list = Object.keys(commands);
const formatted_list = command_list.map(cmd => {
    return `<white class="command">${cmd}</white>`;
});
const help = formatter.format(formatted_list);

// Get directory names
const dirs = Object.keys(directories);

// Terminal setup and configuration
figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts' });
figlet.preloadFonts([font], ready);

// Terminal formatters
$.terminal.xml_formatter.tags.green = () => {
    return `[[;#44D544;]`;
};

$.terminal.xml_formatter.tags.blue = (attrs) => {
    return `[[;#55F;;${attrs.class}]`;
};

const any_command_re = new RegExp(`^\s*(${command_list.join('|')})`);
const re = new RegExp(`^\s*(${command_list.join('|')})(\s?.*)`);

$.terminal.new_formatter([re, function(_, command, args) {
    return `<white>${command}</white><aqua>${args}</aqua>`;
}]);

// Terminal initialization with mobile-friendly settings
const term = $('.terminal-wrap').terminal(commands, {
    greetings: false,
    checkArity: false,
    exit: false,
    clear: false,
    completion(string) {
        const cmd = this.get_command();
        const { name, rest } = $.terminal.parse_command(cmd);
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) {
                return dirs.map(dir => `~/${dir}`);
            }
            if (rest.startsWith('../') && cwd != root) {
                return dirs.map(dir => `../${dir}`);
            }
            if (cwd === root) {
                return dirs;
            }
        }
        return Object.keys(commands);
    },
    prompt,
    // Refined mobile settings
    mobileMode: true,
    scrollOnEcho: true,
    historySize: 40,
    historyPersistence: true,
    // Fix the enter key issue
    keymap: {
        ENTER: function(e, original) {
            if (isMobile) {
                e.preventDefault();
                const command = this.get_command();
                if (command) {
                    this.set_command('');
                    this.exec(command);
                }
                return false;
            } else {
                return original(e);
            }
        }
    }
});

term.pause();

// Terminal event handlers
term.on('click', '.command', function() {
    const command = $(this).text();
    term.exec(command);
});

// Add responsive behavior for window resizing
window.addEventListener('resize', function() {
    isMobile = window.innerWidth <= 768;
    
    // Update terminal settings based on screen size
    term.settings().mobileMode = true; // Keep mobile mode enabled
    
    // Re-initialize terminal if needed
    if (term.cols() < 80 && !isMobile) {
        isMobile = true;
    }
});

// Fix for touch events and command input
if ('ontouchstart' in window) {
    // Remove any duplicate handlers
    $(document).off('touchend', '.command, .directory');
    
    // Only handle clicks on commands and directories
    $(document).on('touchend', '.command, .directory', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const command = $(this).text();
        term.set_command(command);
        term.exec();
    });
    
    // Prevent the double-enter issue by intercepting the event
    term.on('keydown', function(e) {
        if (e.key === 'Enter' && isMobile) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
}

// Remove the previous command enhancement which might be causing issues
for (const cmd in commands) {
    const originalFunction = commands[cmd];
    commands[cmd] = function(...args) {
        return originalFunction.apply(this, args);
    };
}

// Add a simple utility function to ensure output is visible
function scrollToBottom() {
    term.scroll_to_bottom();
}

// Add a simple command executed event handler
term.on('cmd', function() {
    setTimeout(scrollToBottom, 100);
});
