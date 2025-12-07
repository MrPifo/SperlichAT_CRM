import { Context, FieldCombi, FieldInfo, FieldType, Kontakt } from "@types";
import { utils } from "./utils";

export class Formular {

    context: Context;
    mode: string;
    uid: string | null;
    fields: FormularField[] = [];
    html: JQuery<HTMLElement>;
    srcValues: Record<string, string> = {};

    static iconList: string[] = [
        '500px', 'accessible', 'accusoft', 'acquisitions incorporated', 'ad', 'address book', 'address card', 'adn', 'adversal', 'affiliatetheme', 'airbnb', 'algolia', 'align center', 'align justify', 'align left', 'align right', 'alipay', 'allergies', 'amazon', 'amazon pay', 'ambulance', 'american sign language interpreting', 'amilia', 'anchor', 'android', 'angellist', 'angle double down', 'angle double left', 'angle double right', 'angle double up', 'angle down', 'angle left', 'angle right', 'angle up', 'angry', 'angrycreative', 'angular', 'ankh', 'app store', 'app store ios', 'apper', 'apple', 'apple pay', 'archive', 'archway', 'arrow alternate circle down', 'arrow alternate circle left', 'arrow alternate circle right', 'arrow alternate circle up', 'arrow circle down', 'arrow circle left', 'arrow circle right', 'arrow circle up', 'arrow down', 'arrow left', 'arrow right', 'arrow up', 'arrows alternate', 'arrows alternate horizontal', 'arrows alternate vertical', 'artstation', 'assistive listening systems', 'asterisk', 'asymmetrik', 'at', 'atlassian', 'atom', 'audible', 'audio description', 'autoprefixer', 'avianex', 'aviato', 'award', 'aws',
        'baby', 'baby carriage', 'backward', 'bacon', 'bacteria', 'bacterium', 'bahai', 'balance scale', 'balance scale left', 'balance scale right', 'ban', 'band aid', 'bandcamp', 'barcode', 'bars', 'baseball ball', 'basketball ball', 'bath', 'battery empty', 'battery full', 'battery half', 'battery quarter', 'battery three quarters', 'battle net', 'bed', 'beer', 'behance', 'behance square', 'bell', 'bezier curve', 'bible', 'bicycle', 'biking', 'bimobject', 'binoculars', 'biohazard', 'birthday cake', 'bitbucket', 'bitcoin', 'bity', 'black tie', 'blackberry', 'blender', 'blind', 'blog', 'blogger', 'blogger b', 'bluetooth', 'bluetooth b', 'bold', 'bolt', 'bomb', 'bone', 'bong', 'book', 'book dead', 'book medical', 'book open', 'book reader', 'bookmark', 'bootstrap', 'border all', 'border none', 'border style', 'bowling ball', 'box', 'box open', 'box tissue', 'boxes', 'braille', 'brain', 'bread slice', 'briefcase', 'briefcase medical', 'broadcast tower', 'broom', 'brush', 'btc', 'buffer', 'bug', 'building', 'bullhorn', 'bullseye', 'burn', 'buromobelexperte', 'bus', 'bus alternate', 'business time', 'buy n large', 'buysellads',
        'calculator', 'calendar', 'calendar alternate', 'calendar check', 'calendar day', 'calendar minus', 'calendar plus', 'calendar times', 'calendar week', 'camera', 'camera retro', 'campground', 'canadian maple leaf', 'candy cane', 'cannabis', 'capsules', 'car', 'car alternate', 'car battery', 'car crash', 'car side', 'caravan', 'caret down', 'caret left', 'caret right', 'caret square down', 'caret square left', 'caret square right', 'caret square up', 'caret up', 'carrot', 'cart arrow down', 'cart plus', 'cash register', 'cat', 'cc amazon pay', 'cc amex', 'cc apple pay', 'cc diners club', 'cc discover', 'cc jcb', 'cc mastercard', 'cc paypal', 'cc stripe', 'cc visa', 'centercode', 'centos', 'certificate', 'chair', 'chalkboard', 'chalkboard teacher', 'charging station', 'chart area', 'chart bar', 'chart pie', 'chartline', 'check', 'check circle', 'check double', 'check square', 'cheese', 'chess', 'chess bishop', 'chess board', 'chess king', 'chess knight', 'chess pawn', 'chess queen', 'chess rook', 'chevron circle down', 'chevron circle left', 'chevron circle right', 'chevron circle up', 'chevron down', 'chevron left', 'chevron right', 'chevron up', 'child', 'chrome', 'chromecast', 'church', 'circle', 'circle notch', 'city', 'clinic medical', 'clipboard', 'clipboard check', 'clipboard list', 'clock', 'clone', 'closed captioning', 'cloud', 'cloud download alternate', 'cloud meatball', 'cloud moon', 'cloud moon rain', 'cloud rain', 'cloud showers heavy', 'cloud sun', 'cloud sun rain', 'cloud upload alternate', 'cloudflare', 'cloudscale', 'cloudsmith', 'cloudversify', 'cocktail', 'code', 'code branch', 'codepen', 'codiepie', 'coffee', 'cog', 'cogs', 'coins', 'columns', 'comment', 'comment alternate', 'comment dollar', 'comment dots', 'comment medical', 'comment slash', 'comments', 'comments dollar', 'compact disc', 'compass', 'compress', 'compress alternate', 'compress arrows alternate', 'concierge bell', 'confluence', 'connectdevelop', 'contao', 'cookie', 'cookie bite', 'copy', 'copyright', 'cotton bureau', 'couch', 'cpanel', 'creative commons', 'creative commons by', 'creative commons nc', 'creative commons nc eu', 'creative commons nc jp', 'creative commons nd', 'creative commons pd', 'creative commons pd alternate', 'creative commons remix', 'creative commons sa', 'creative commons sampling', 'creative commons sampling plus', 'creative commons share', 'creative commons zero', 'credit card', 'critical role', 'crop', 'crop alternate', 'cross', 'crosshairs', 'crow', 'crutch', 'css3', 'css3 alternate', 'cube', 'cubes', 'cut', 'cuttlefish',
        'd and d', 'd and d beyond', 'dailymotion', 'dashcube', 'database', 'deaf', 'deezer', 'delicious', 'democrat', 'deploydog', 'deskpro', 'desktop', 'dev', 'deviantart', 'dharmachakra', 'dhl', 'diagnoses', 'diaspora', 'dice', 'dice d20', 'dice d6', 'dice five', 'dice four', 'dice one', 'dice six', 'dice three', 'dice two', 'digg', 'digital ocean', 'digital tachograph', 'directions', 'discord', 'discourse', 'disease', 'divide', 'dizzy', 'dna', 'dochub', 'docker', 'dog', 'dollar sign', 'dolly', 'dolly flatbed', 'donate', 'door closed', 'door open', 'dot circle', 'dove', 'download', 'draft2digital', 'drafting compass', 'dragon', 'draw polygon', 'dribbble', 'dribbble square', 'dropbox', 'drum', 'drum steelpan', 'drupal', 'dumbbell', 'dumpster', 'dungeon', 'dyalog',
        'earlybirds', 'ebay', 'edge', 'edge legacy', 'edit', 'egg', 'eject', 'elementor', 'ellipsis horizontal', 'ellipsis vertical', 'ello', 'ember', 'empire', 'envelope', 'envelope open', 'envelope open text', 'envelope square', 'envira', 'equals', 'eraser', 'erlang', 'ethereum', 'ethernet', 'etsy', 'euro sign', 'evernote', 'exchange alternate', 'exclamation', 'exclamation circle', 'exclamation triangle', 'expand', 'expand alternate', 'expand arrows alternate', 'expeditedssl', 'external alternate', 'external link square alternate', 'eye', 'eye dropper', 'eye slash',
        'facebook', 'facebook f', 'facebook messenger', 'facebook square', 'fan', 'fantasy flight games', 'fast backward', 'fast forward', 'faucet', 'fax', 'feather', 'feather alternate', 'fedex', 'fedora', 'female', 'figma', 'fighter jet', 'file', 'file alternate', 'file archive', 'file audio', 'file code', 'file contract', 'file download', 'file excel', 'file export', 'file image', 'file import', 'file invoice', 'file invoice dollar', 'file medical', 'file medical alternate', 'file pdf', 'file powerpoint', 'file prescription', 'file signature', 'file upload', 'file video', 'file word', 'fill', 'fill drip', 'film', 'filter', 'fingerprint', 'fire', 'fire alternate', 'fire extinguisher', 'firefox', 'firefox browser', 'first aid', 'first order', 'first order alternate', 'firstdraft', 'fish', 'fist raised', 'flag', 'flag checkered', 'flag usa', 'flask', 'flickr', 'flipboard', 'flushed', 'fly', 'folder', 'folder minus', 'folder open', 'folder plus', 'font', 'font awesome', 'font awesome alternate', 'font awesome flag', 'fonticons', 'fonticons fi', 'football ball', 'fort awesome', 'fort awesome alternate', 'forumbee', 'forward', 'foursquare', 'free code camp', 'freebsd', 'frog', 'frown', 'frown open', 'fruit-apple', 'fulcrum', 'funnel dollar', 'futbol',
        'galactic republic', 'galactic senate', 'gamepad', 'gas pump', 'gavel', 'gem', 'genderless', 'get pocket', 'gg', 'gg circle', 'ghost', 'gift', 'gifts', 'git', 'git alternate', 'git square', 'github', 'github alternate', 'github square', 'gitkraken', 'gitlab', 'gitter', 'glass cheers', 'glass martini', 'glass martini alternate', 'glass whiskey', 'glasses', 'glide', 'glide g', 'globe', 'globe africa', 'globe americas', 'globe asia', 'globe europe', 'gofore', 'golf ball', 'goodreads', 'goodreads g', 'google', 'google drive', 'google pay', 'google play', 'google plus', 'google plus g', 'google plus square', 'google wallet', 'gopuram', 'graduation cap', 'gratipay', 'grav', 'greater than', 'greater than equal', 'grimace', 'grin', 'grin alternate', 'grin beam', 'grin beam sweat', 'grin hearts', 'grin squint', 'grin squint tears', 'grin stars', 'grin tears', 'grin tongue', 'grin tongue squint', 'grin tongue wink', 'grin wink', 'grip horizontal', 'grip lines', 'grip lines vertical', 'grip vertical', 'gripfire', 'grunt', 'guilded', 'guitar', 'gulp',
        'h square', 'hacker news', 'hacker news square', 'hackerrank', 'hamburger', 'hammer', 'hamsa', 'hand holding', 'hand holding heart', 'hand holding medical', 'hand holding usd', 'hand holding water', 'hand lizard', 'hand middle finger', 'hand paper', 'hand peace', 'hand point down', 'hand point left', 'hand point right', 'hand point up', 'hand pointer', 'hand rock', 'hand scissors', 'hand sparkles', 'hand spock', 'hands', 'hands helping', 'hands wash', 'handshake', 'handshake alternate slash', 'handshake slash', 'hanukiah', 'hard hat', 'hashtag', 'hat cowboy', 'hat cowboy side', 'hat wizard', 'hdd', 'head side cough', 'head side cough slash', 'head side mask', 'head side virus', 'heading', 'headphones', 'headphones alternate', 'headset', 'heart', 'heart broken', 'heartbeat', 'helicopter', 'highlighter', 'hiking', 'hips', 'hire a helper', 'history', 'hive', 'hockey puck', 'holly berry', 'home', 'hooli', 'hornbill', 'horse', 'horse head', 'hospital', 'hospital alternate', 'hospital symbol', 'hospital user', 'hot tub', 'hotdog', 'hotel', 'hotjar', 'hourglass', 'hourglass end', 'hourglass half', 'hourglass start', 'house damage', 'house user', 'houzz', 'hryvnia', 'html5', 'hubspot',
        'i cursor', 'ice cream', 'icicles', 'icons', 'id badge', 'id card', 'id card alternate', 'ideal', 'igloo', 'image', 'images', 'imdb', 'inbox', 'indent', 'industry', 'infinity', 'info', 'info circle', 'innosoft', 'instagram', 'instagram square', 'instalod', 'intercom', 'internet explorer', 'invision', 'ioxhost', 'itch io', 'italic', 'itunes', 'itunes note',
        'java', 'jedi', 'jedi order', 'jenkins', 'jira', 'joget', 'joint', 'joomla', 'journal whills', 'js', 'js square', 'jsfiddle',
        'kaaba', 'kaggle', 'key', 'keybase', 'keyboard', 'keycdn', 'khanda', 'kickstarter', 'kickstarter k', 'kiss', 'kiss beam', 'kiss wink heart', 'kiwi bird', 'korvue',
        'landmark', 'language', 'laptop', 'laptop code', 'laptop house', 'laptop medical', 'laravel', 'lastfm', 'lastfm square', 'laugh', 'laugh beam', 'laugh squint', 'laugh wink', 'layer group', 'leaf', 'leanpub', 'lemon', 'lesscss', 'less than', 'less than equal', 'level down alternate', 'level up alternate', 'life ring', 'lightbulb', 'linechat', 'linkedin', 'linkify', 'linode', 'linux', 'lira sign', 'list', 'list alternate', 'list ol', 'list ul', 'location arrow', 'lock', 'lock open', 'long arrow alternate down', 'long arrow alternate left', 'long arrow alternate right', 'long arrow alternate up', 'low vision', 'luggage cart', 'lungs', 'lungs virus', 'lyft',
        'magento', 'magic', 'magnet', 'mail bulk', 'mailchimp', 'male', 'mandalorian', 'map', 'map marked', 'map marked alternate', 'map marker', 'map marker alternate', 'map pin', 'map signs', 'markdown', 'marker', 'mars', 'mars double', 'mars stroke', 'mars stroke horizontal', 'mars stroke vertical', 'mask', 'mastodon', 'maxcdn', 'mdb', 'medal', 'medapps', 'medium', 'medium m', 'medkit', 'medrt', 'meetup', 'megaport', 'meh', 'meh blank', 'meh rolling eyes', 'memory', 'mendeley', 'menorah', 'mercury', 'meteor', 'microblog', 'microchip', 'microphone', 'microphone alternate', 'microphone alternate slash', 'microphone slash', 'microscope', 'microsoft', 'minus', 'minus circle', 'minus square', 'mitten', 'mix', 'mixcloud', 'mixer', 'mizuni', 'mobile', 'mobile alternate', 'modx', 'monero', 'money bill', 'money bill alternate', 'money bill wave', 'money bill wave alternate', 'money check', 'money check alternate', 'monument', 'moon', 'mortar pestle', 'mosque', 'motorcycle', 'mountain', 'mouse', 'mouse pointer', 'mug hot', 'music',
        'napster', 'neos', 'neuter', 'newspaper', 'nimblr', 'node', 'node js', 'not equal', 'notes medical', 'npm', 'ns8', 'nutritionix',
        'object group', 'object ungroup', 'octopus deploy', 'odnoklassniki', 'odnoklassniki square', 'oil can', 'old republic', 'om', 'opencart', 'openid', 'opera', 'optin monster', 'orcid', 'osi', 'otter', 'outdent',
        'page4', 'pagelines', 'pager', 'paint brush', 'paint roller', 'palette', 'palfed', 'pallet', 'paper plane', 'paperclip', 'parachute box', 'paragraph', 'parking', 'passport', 'pastafarianism', 'paste', 'patreon', 'pause', 'pause circle', 'paw', 'paypal', 'peace', 'pen', 'pen alternate', 'pen fancy', 'pen nib', 'pen square', 'pencil alternate', 'pencil ruler', 'penny arcade', 'people arrows', 'people carry', 'pepper hot', 'perbyte', 'percent', 'percentage', 'periscope', 'person booth', 'phabricator', 'phoenix framework', 'phoenix squadron', 'phone', 'phone alternate', 'phone slash', 'phone square', 'phone square alternate', 'phone volume', 'photo video', 'php', 'pied piper', 'pied piper alternate', 'pied piper hat', 'pied piper pp', 'pied piper square', 'piggy bank', 'pills', 'pinterest', 'pinterest p', 'pinterest square', 'pizza slice', 'place of worship', 'plane', 'plane arrival', 'plane departure', 'play', 'play circle', 'playstation', 'plug', 'plus', 'plus circle', 'plus square', 'podcast', 'poll', 'poll horizontal', 'poo', 'poo storm', 'poop', 'portrait', 'pound sign', 'power off', 'pray', 'praying hands', 'prescription', 'prescription bottle', 'prescription bottle alternate', 'print', 'procedures', 'product hunt', 'project diagram', 'pump medical', 'pump soap', 'pushed', 'puzzle piece', 'python',
        'qq', 'qrcode', 'question', 'question circle', 'quidditch', 'quinscape', 'quora', 'quote left', 'quote right', 'quran',
        'r project', 'radiation', 'radiation alternate', 'rainbow', 'random', 'raspberry pi', 'ravelry', 'react', 'reacteurope', 'readme', 'rebel', 'receipt', 'record vinyl', 'recycle', 'reddit', 'reddit alien', 'reddit square', 'redhat', 'redriver', 'redyeti', 'redo', 'redo alternate', 'registered', 'remove format', 'renren', 'reply', 'reply all', 'replyd', 'republican', 'researchgate', 'resolving', 'restroom', 'retweet', 'rev', 'ribbon', 'ring', 'road', 'robot', 'rocket', 'rocketchat', 'rockrms', 'route', 'rss', 'rss square', 'ruble sign', 'ruler', 'ruler combined', 'ruler horizontal', 'ruler vertical', 'running', 'rupee sign', 'rust',
        'sad cry', 'sad tear', 'safari', 'salesforce', 'sass', 'satellite', 'satellite dish', 'save', 'schlix', 'school', 'screwdriver', 'scribd', 'scroll', 'sd card', 'search', 'search dollar', 'search location', 'search minus', 'search plus', 'searchengin', 'seedling', 'sellcast', 'sellsy', 'server', 'servicestack', 'shapes', 'share', 'share alternate', 'share alternate square', 'share square', 'shekel sign', 'shield alternate', 'shield virus', 'ship', 'shipping fast', 'shirtsinbulk', 'shoe prints', 'shopify', 'shopping bag', 'shopping basket', 'shopping cart', 'shopware', 'shower', 'shuttle van', 'sign', 'sign in alternate', 'sign language', 'sign out alternate', 'signal', 'signature', 'sim card', 'simplybuilt', 'sink', 'sistrix', 'sith', 'sitemap', 'skating', 'sketch', 'skiing', 'skiing nordic', 'skull crossbones', 'skyatlas', 'skype', 'slack', 'slack hash', 'slash', 'sleigh', 'sliders horizontal', 'slideshare', 'smile', 'smile beam', 'smile wink', 'smog', 'smoking', 'smoking ban', 'sms', 'snapchat', 'snapchat ghost', 'snapchat square', 'snowboarding', 'snowflake', 'snowman', 'snowplow', 'soap', 'socks', 'solar panel', 'sort', 'sort alphabet down', 'sort alphabet down alternate', 'sort alphabet up', 'sort alphabet up alternate', 'sort amount down', 'sort amount down alternate', 'sort amount up', 'sort amount up alternate', 'sort down', 'sort numeric down', 'sort numeric down alternate', 'sort numeric up', 'sort numeric up alternate', 'sort up', 'soundcloud', 'sourcetree', 'spa', 'space shuttle', 'speakap', 'speaker deck', 'spell check', 'spider', 'spinner', 'splotch', 'spotify', 'spray can', 'square', 'square full', 'square root alternate', 'squarespace', 'stack exchange', 'stack overflow', 'stackpath', 'stamp', 'star', 'star and crescent', 'star half', 'star half alternate', 'star of david', 'star of life', 'staylinked', 'steam', 'steam square', 'steam symbol', 'step backward', 'step forward', 'stethoscope', 'sticker mule', 'sticky note', 'stop', 'stop circle', 'stopwatch', 'store', 'store alternate', 'store alternate slash', 'store slash', 'strava', 'stream', 'street view', 'strikethrough', 'stripe', 'stripe s', 'stroopwafel', 'studiovinari', 'stumbleupon', 'stumbleupon circle', 'subscript', 'subway', 'suitcase', 'suitcase rolling', 'sun', 'superpowers', 'superscript', 'supple', 'surprise', 'suse', 'swatchbook', 'swift', 'swimmer', 'swimming pool', 'symfony', 'synagogue', 'sync', 'sync alternate', 'syringe',
        'table', 'table tennis', 'tablet', 'tablet alternate', 'tablets', 'tachometer alternate', 'tag', 'tags', 'tape', 'tasks', 'taxi', 'teamspeak', 'teeth', 'teeth open', 'telegram', 'telegram plane', 'temperature high', 'temperature low', 'tencent weibo', 'tenge', 'terminal', 'text height', 'text width', 'th', 'th large', 'th list', 'theater masks', 'themeco', 'themeisle', 'thermometer', 'thermometer empty', 'thermometer full', 'thermometer half', 'thermometer quarter', 'thermometer three quarters', 'think peaks', 'thumbs down', 'thumbs up', 'thumbtack', 'ticket alternate', 'tiktok', 'times', 'times circle', 'tint', 'tint slash', 'tired', 'toggle off', 'toggle on', 'toilet', 'toilet paper', 'toilet paper slash', 'toolbox', 'tools', 'tooth', 'torah', 'torii gate', 'tractor', 'trade federation', 'trademark', 'traffic light', 'trailer', 'train', 'tram', 'transgender', 'transgender alternate', 'trash', 'trash alternate', 'trash restore', 'trash restore alternate', 'tree', 'trello', 'trophy', 'truck', 'truck monster', 'truck moving', 'truck packing', 'truck pickup', 'tshirt', 'tty', 'tumblr', 'tumblr square', 'tv', 'twitch', 'twitter', 'twitter square', 'typo3',
        'uber', 'ubuntu', 'uikit', 'umbraco', 'umbrella', 'umbrella beach', 'uncharted', 'underline', 'undo', 'undo alternate', 'uniregistry', 'unity', 'universal access', 'university', 'unlink', 'unlock', 'unlock alternate', 'unsplash', 'untappd', 'upload', 'ups', 'usb', 'user', 'user alternate', 'user alternate slash', 'user astronaut', 'user check', 'user circle', 'user clock', 'user cog', 'user edit', 'user friends', 'user graduate', 'user injured', 'user lock', 'user md', 'user minus', 'user ninja', 'user nurse', 'user plus', 'user secret', 'user shield', 'user slash', 'user tag', 'user tie', 'user times', 'users', 'users cog', 'users slash', 'usps', 'ussunnah', 'utensil spoon', 'utensils',
        'vaadin', 'vector square', 'venus', 'venus double', 'venus mars', 'vest', 'vest patches', 'viacoin', 'viadeo', 'viadeo square', 'vial', 'vials', 'viber', 'video', 'video slash', 'vihara', 'vimeo', 'vimeo square', 'vimeo v', 'vine', 'virus', 'virus slash', 'viruses', 'vk', 'vnv', 'voicemail', 'volleyball ball', 'volume down', 'volume mute', 'volume off', 'volume up', 'vote yea', 'vuejs',
        'walking', 'wallet', 'warehouse', 'watchman monitoring', 'water', 'wave square', 'waze', 'weebly', 'weibo', 'weight', 'weixin', 'whatsapp', 'whatsapp square', 'wheelchair', 'whmcs', 'wifi', 'wikipedia w', 'wind', 'window close', 'window maximize', 'window minimize', 'window restore', 'windows', 'wine bottle', 'wine glass', 'wine glass alternate', 'wix', 'wizards of the coast', 'wodu', 'wolf pack battalion', 'won sign', 'wordpress', 'wordpress simple', 'wpbeginner', 'wpexplorer', 'wpforms', 'wpressr', 'wrench',
        'x ray', 'xbox', 'xing', 'xing square',
        'y combinator', 'yahoo', 'yammer', 'yandex', 'yandex international', 'yarn', 'yelp', 'yen sign', 'yin yang', 'yoast', 'youtube', 'youtube square',
        'zhihu'
    ];
    static colorList: { name: string, hex: string }[] = [
        { name: 'Rot', hex: '#ec2020ff' },
        { name: 'Dunkelrot', hex: '#b32e2eff' },
        { name: 'Orange', hex: '#ff9b49' },
        { name: 'Gelb', hex: '#FFC107' },
        { name: 'Lime', hex: '#8bc34a' },
        { name: 'Grün', hex: '#4caf50' },
        { name: 'Teal', hex: '#009688' },
        { name: 'Türkis', hex: '#00BCD4' },
        { name: 'Hellblau', hex: '#03a9f4' },
        { name: 'Blau', hex: '#007de4ff' },
        { name: 'Indigo', hex: '#1a237e' },
        { name: 'Violett', hex: '#673AB7' },
        { name: 'Pink', hex: '#E91E63' },
        { name: 'Peach', hex: '#f8a5c2' },
        { name: 'Braun', hex: '#795548' },
        { name: 'Grau', hex: '#757575' },
        { name: 'Blaugrau', hex: '#607d8b' },
        { name: 'Schwarz', hex: '#212121' },
        { name: 'Weiß', hex: '#fafafa' }
    ];

    constructor(contextName: string, mode: string, uid?: string, valueMap?: Record<string, string>) {
        this.mode = mode;
        this.context = utils.getContextByName(contextName);
        const fieldCombis = this.context.editStructure;
        this.uid = uid ?? null;

        if (!fieldCombis) {
            this.html = $("<div>Unbekannter Typ</div>");
            return;
        }

        const container = $("<div></div>");
        fieldCombis.forEach(combi => container.append(this.renderFieldCombi(combi)));
        this.html = container;

        if (valueMap) {
            this.setValues(valueMap);
        }
    }

    renderFieldCombi(combi: FieldCombi): JQuery<HTMLElement> {
        const amounts = ['', 'one', 'two', 'three', 'four', 'five'];
        const combiClass = combi.columnCount > 1 ? `${amounts[combi.columnCount]} fields` : 'field';
        const combiHtml = $(`<div class="${combiClass}"></div>`);

        combi.fields.forEach(field => {
            const formField = new FormularField(field);
            this.fields.push(formField);
            combiHtml.append(formField.html);
        });

        return combiHtml;
    }

    setValues(values: Record<string, string>) {
        this.srcValues = { ...values };
        this.fields.forEach(field => {
            if (values[field.name] !== undefined) {
                field.setValue(values[field.name]);
            }
        });
    }

    getValues(): Record<string, string> {
        const values: Record<string, string> = {};
        this.fields.forEach(field => {
            values[field.name] = field.getValue();
        });
        return values;
    }

    getValuesAsArray(columns?: string[]): string[] {
        const values = this.getValues();
        const keys = columns ?? Object.keys(values);
        return keys.map(col => values[col] ?? '');
    }

    getChangedValues(): Record<string, string> {
        const changed: Record<string, string> = {};
        this.fields.forEach(field => {
            const current = field.getValue();
            if (current !== (this.srcValues[field.name] ?? '')) {
                changed[field.name] = current;
            }
        });
        return changed;
    }

    getChangedValuesAsArray(columns?: string[]): { columns: string[], values: string[] } {
        const changed = this.getChangedValues();
        const keys = columns?.filter(c => changed[c] !== undefined) ?? Object.keys(changed);
        return {
            columns: keys,
            values: keys.map(c => changed[c])
        };
    }

    isValid(): boolean {
        return this.fields.every(field => field.isValid());
    }

    reset() {
        this.fields.forEach(field => {
            field.setValue(this.srcValues[field.name] ?? '');
        });
    }

    setLoading(loading: boolean) {
        this.fields.forEach(field => field.setLoading(loading));
    }

    setLocked(locked: boolean) {
        this.fields.forEach(field => field.setLocked(locked));
    }
}

class FormularField {
    info: FieldInfo;
    html: JQuery<HTMLElement>;
    input: JQuery<HTMLElement>;
    pendingValue: string | null = null;

    get name(): string { return this.info.name; }
    get label(): string { return this.info.label; }
    get type(): FieldType { return this.info.type; }

    constructor(info: FieldInfo) {
        this.info = info;
        let inputHtml = '';

        switch (this.type) {
            case FieldType.TEXT:
                inputHtml = `<input type="text" id="${this.name}" placeholder="${this.label}">`;
                break;
            case FieldType.LONGTEXT:
                inputHtml = `<textarea id="${this.name}" rows="3" placeholder="${this.label}"></textarea>`;
                break;
            case FieldType.DATE:
                inputHtml = `<input type="date" id="${this.name}">`;
                break;
            case FieldType.KEYWORD:
                inputHtml = `
                    <div id="${this.name}" class="ui inverted search selection dropdown">
                        <input type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Laden...</div>
                        <div class="menu"></div>
                    </div>
                `;
                break;
            case FieldType.BOOL:
                inputHtml = `
                    <div id="${this.name}" class="ui toggle checkbox">
                        <input type="checkbox">
                        <label></label>
                    </div>
                `;
                break;
            case FieldType.ICON:
                inputHtml = `
                    <div id="${this.name}" class="ui inverted search selection dropdown">
                        <input type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Icon auswählen...</div>
                        <div class="menu"></div>
                    </div>
                `;
                break;
            case FieldType.COLOR:
                inputHtml = `
                    <div id="${this.name}" class="ui inverted selection dropdown">
                        <input type="hidden">
                        <i class="dropdown icon"></i>
                        <div class="default text">Farbe auswählen...</div>
                        <div class="menu"></div>
                    </div>
                `;
                break;
        }

        this.html = $(`
            <div class="field">
                <label>${this.label}</label>
                ${inputHtml}
            </div>
        `);

        if (this.type === FieldType.KEYWORD) {
            this.input = this.html.find(`#${this.name}`);
            this.loadKeywords();
        } else if (this.type === FieldType.BOOL) {
            this.input = this.html.find(`#${this.name}`);
            (this.input as any).checkbox();
        } else if (this.type === FieldType.ICON) {
            this.input = this.html.find(`#${this.name}`);
            this.loadIcons();
        } else if (this.type === FieldType.COLOR) {
            this.input = this.html.find(`#${this.name}`);
            this.loadColors();
        } else {
            this.input = this.html.find('input, textarea, select');
        }
    }

    async loadIcons() {
        const menu = this.input.find('.menu');
        const items = Formular.iconList.map(icon =>
            `<div class="item" data-value="${icon}"><i class="${icon} icon"></i>${icon}</div>`
        ).join('');
        menu.html(items);

        (this.input as any).dropdown({
            placeholder: this.label,
            clearable: true
        });

        if (this.pendingValue !== null) {
            (this.input as any).dropdown('set selected', this.pendingValue);
            this.pendingValue = null;
        }
    }

    async loadKeywords() {
        const values = await this.info.getKeywordValues();
        const menu = this.input.find('.menu');
        
        const items = values.map(o => {
            const [keyid, data] = o;
            if (typeof data === 'string') {
                return `<div class="item" data-value="${keyid}">${data}</div>`;
            } else {
                const iconHtml = data.icon 
                    ? `<i class="${data.icon} icon" style="${data.color ? `color: ${data.color};` : ''}margin-right: 8px;"></i>` 
                    : '';
                return `<div class="item" data-value="${keyid}">${iconHtml}${data.title}</div>`;
            }
        }).join('');
        menu.html(items);

        (this.input as any).dropdown({
            placeholder: this.label,
            allowAdditions: true,
            clearable: true
        });

        if (this.pendingValue !== null) {
            (this.input as any).dropdown('set selected', this.pendingValue);
            this.pendingValue = null;
        }
    }

    loadColors() {
        const menu = this.input.find('.menu');
        const items = Formular.colorList.map(color =>
            `<div class="item" data-value="${color.hex}">
            <div class="ui empty circular label" style="background-color: ${color.hex}; margin-right: 8px;"></div>
            ${color.name}
        </div>`
        ).join('');
        menu.html(items);

        (this.input as any).dropdown({
            placeholder: this.label,
            clearable:true
        });

        if (this.pendingValue !== null) {
            (this.input as any).dropdown('set selected', this.pendingValue);
            this.pendingValue = null;
        }
    }

    getValue(): string {
        if (this.type === FieldType.BOOL) {
            return (this.input as any).checkbox('is checked') ? '1' : '0';
        }
        if (this.type === FieldType.KEYWORD || this.type === FieldType.ICON || this.type === FieldType.COLOR) {
            return this.input.find('input[type="hidden"]').val() as string ?? '';
        }
        return this.input.val() as string ?? '';
    }

    setValue(value: string) {
        if (this.type === FieldType.BOOL) {
            const checkbox = this.input.find('input[type="checkbox"]');
            checkbox.prop('checked', utils.toBoolean(value));
        } else if (this.type === FieldType.KEYWORD || this.type === FieldType.ICON || this.type === FieldType.COLOR) {
            if (this.input.hasClass('active') || this.input.find('.menu .item').length > 0) {
                (this.input as any).dropdown('set selected', value);
            } else {
                this.pendingValue = value;
            }
        } else {
            this.input.val(value);
        }
    }

    isValid(): boolean {
        return this.getValue().trim() !== '';
    }

    setLoading(loading: boolean) {
        if (loading) {
            this.html.addClass('loading disabled');
            this.input.attr('placeholder', 'Laden...');
            this.input.prop('disabled', true);
        } else {
            this.html.removeClass('loading disabled');
            this.input.attr('placeholder', this.label);
            this.input.prop('disabled', false);
        }
    }

    setLocked(locked: boolean) {
        if (locked) {
            this.html.addClass('disabled');
            this.input.prop('disabled', true);
        } else {
            this.html.removeClass('disabled');
            this.input.prop('disabled', false);
        }
    }
}