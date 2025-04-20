// Constants and Global Variables
const root = '~';
let cwd = root; // Current working directory state
const user = 'guest';
const server = 'AyaanRathod';
const font = 'slant';
let isMobile = window.innerWidth <= 768; // Mobile detection

// Command descriptions, directory data, and command implementations
// are now expected to be loaded from commands.js

// Utility functions (keep ones needed by my-terminal.js)
function prompt() {
    // Use the global cwd variable
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

// Make ready function global so commands.js (clear command) can call it
window.ready = function() {
    // Use the same rendering function for both mobile and desktop
    term.echo(() => (render('Ayaan Rathod')))
       .echo('[[;cyan;]\nWelcome to my' + (isMobile ? '' : ' Interactive') + ' Terminal Portfolio!]')
       .echo('');

    if (isMobile) {
        // Shorter instructions for mobile
        term.echo('[[;#44D544;]→] Type [[;yellow;]help] for commands')
            .echo('[[;#44D544;]→] Try [[;yellow;]aboutme] to learn about me')
            .echo('');
    } else {
        // Full instructions for desktop
        term.echo('[[;#44D544;]→] Type [[;yellow;]help] to see all available commands')
           .echo('[[;#44D544;]→] Try [[;yellow;]aboutme] to learn about my background')
           .echo('[[;#44D544;]→] Check out [[;yellow;]projects] to see what I\'ve built')
           .echo('[[;#44D544;]→] Use [[;yellow;]cd education] to view my academic courses')
           .echo('[[;#44D544;]→] Use [[;yellow;]main] to visit my main portfolio site')
           .echo('')
           .echo('[[;white;]Navigate like you would in a real terminal - have fun exploring!]\n');
    }
    // Ensure terminal is resumed only after initial setup
    // Check if terminal exists and is paused before resuming
    if (term && term.paused()) {
        term.resume();
    }
}

// Terminal commands object is now loaded from commands.js
// Ensure commands.js is loaded before this script in index.html

// Help formatter (using command_list from commands.js)
const formatter = new Intl.ListFormat('en', {
    style: 'long',
    type: 'conjunction',
});

// Ensure command_list is available from commands.js
const formatted_list = typeof command_list !== 'undefined'
    ? command_list.map(cmd => `<white class="command">${cmd}</white>`)
    : [];
const help = formatter.format(formatted_list);

// Terminal setup and configuration
figlet.defaults({ fontPath: 'https://unpkg.com/figlet/fonts' });
// Call the global ready function once fonts are loaded
figlet.preloadFonts([font], window.ready);

// Terminal formatters
$.terminal.xml_formatter.tags.green = () => `[[;#44D544;]`;
$.terminal.xml_formatter.tags.blue = (attrs) => `[[;#55F;;${attrs.class}]`;

// Ensure command_list is available for the regex
const command_list_for_re = typeof command_list !== 'undefined' ? command_list : ['help', 'ls', 'cd', 'echo', 'aboutme', 'github', 'resume', 'projects', 'main', 'clear']; // Fallback
const any_command_re = new RegExp(`^\\s*(${command_list_for_re.join('|')})`);
const re = new RegExp(`^\\s*(${command_list_for_re.join('|')})(\\s?.*)`);

$.terminal.new_formatter([re, function(_, command, args) {
    // Check if args exist before adding aqua formatting
    return args && args.trim() !== ''
        ? `<white>${command}</white><aqua>${args}</aqua>`
        : `<white>${command}</white>`;
}]);

// REMOVED custom mobile keydown handler

// Terminal initialization
// Ensure 'commands' object is available from commands.js
const term = $('.terminal-wrap').terminal(typeof commands !== 'undefined' ? commands : {}, { // Use commands from commands.js
    greetings: false, // Disable default greetings, we use ready()
    checkArity: false,
    exit: false,
    clear: false, // Disable built-in clear, use our command
    completion(string) {
        // Ensure 'dirs' is available from commands.js
        const available_dirs = typeof dirs !== 'undefined' ? dirs : []; // Fallback
        const cmd = this.get_command();
        const { name, rest } = $.terminal.parse_command(cmd);
        if (['cd', 'ls'].includes(name)) {
            if (rest.startsWith('~/')) {
                return available_dirs.map(dir => `~/${dir}`);
            }
            if (cwd !== root) { // Allow '..' completion only if not in root
                 if (rest.startsWith('../')) {
                     // Basic completion for ../ - could be smarter
                     return ['../'];
                 }
                 // Add current directory files/dirs if needed in future
            }
            if (cwd === root) { // Suggest dirs from root
                return available_dirs;
            }
        }
        // Use command_list from commands.js for command completion
        return typeof command_list !== 'undefined' ? command_list : [];
    },
    prompt,
    mobileMode: isMobile, // Enable/disable mobile specific behavior
    scrollOnEcho: true, // Try enabling default scroll on echo
    historySize: 40,
    // Hook after command execution to ensure scroll
    onAfterExec: function() {
        this.scroll_to_bottom();
    },
    // Adjust focus behavior slightly
    focus: true // Keep focus on load/interaction
});

// Pause terminal initially until figlet fonts are loaded and ready() is called
term.pause();

// Terminal event handlers
term.on('click', '.command', function() {
    const command = $(this).text();
    term.exec(command, true); // Execute silently if needed, or just term.exec(command)
    // No need to manually scroll here if onAfterExec works
});

term.on('click', '.directory', function() {
    const dir = $(this).text();
    term.exec(`cd ${dir}`, true);
});


// Handle window resizing
window.addEventListener('resize', function() {
    const newIsMobile = window.innerWidth <= 768;
    if (newIsMobile !== isMobile) {
        isMobile = newIsMobile;
        term.settings().mobileMode = isMobile;
        // Optionally re-run ready() or adjust display if needed
        // term.clear(); // Example: clear and re-run ready on mode change
        // ready();
    }
    // Adjust layout or figlet rendering on resize if necessary
    term.resize(); // Notify terminal about resize
});

// Handle touch events for focus (keep this)
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function(e) {
        // Only focus if the touch is not on an interactive element like a link
        if (!$(e.target).closest('a, .command, .directory').length) {
             // Small delay might help prevent interfering with scrolling/tapping links
             setTimeout(() => term.focus(), 50);
        }
    });
}
