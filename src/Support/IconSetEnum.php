<?php

namespace Erag\InertiaForms\Support;

/**
 * The icon set shipped with the package. The value is the name used with
 * `icon()`; `path()` is the SVG path `d` value of a 24×24 stroke icon that is
 * sent with the form, and `category()` groups the icons for the docs.
 *
 * The icons the frontend packages draw themselves are listed in `Icon::BUILT_IN`.
 */
enum IconSetEnum: string
{
    // People
    case Users = 'users';
    case UserPlus = 'userPlus';
    case UserMinus = 'userMinus';
    case UserCheck = 'userCheck';
    case UserX = 'userX';
    case UserCircle = 'userCircle';
    case IdCard = 'idCard';
    case Smile = 'smile';
    case Frown = 'frown';

    // Communication
    case Phone = 'phone';
    case MessageCircle = 'messageCircle';
    case MessageSquare = 'messageSquare';
    case Inbox = 'inbox';
    case AtSign = 'atSign';
    case Bell = 'bell';
    case BellOff = 'bellOff';
    case Megaphone = 'megaphone';
    case Rss = 'rss';

    // Files
    case File = 'file';
    case FilePlus = 'filePlus';
    case FileCheck = 'fileCheck';
    case Folder = 'folder';
    case FolderOpen = 'folderOpen';
    case Clipboard = 'clipboard';
    case ClipboardCheck = 'clipboardCheck';
    case Download = 'download';
    case Archive = 'archive';
    case Printer = 'printer';
    case Book = 'book';
    case BookOpen = 'bookOpen';
    case Bookmark = 'bookmark';

    // Text and code
    case Pencil = 'pencil';
    case Scissors = 'scissors';
    case Type = 'type';
    case Bold = 'bold';
    case Italic = 'italic';
    case Underline = 'underline';
    case Heading = 'heading';
    case AlignLeft = 'alignLeft';
    case AlignCenter = 'alignCenter';
    case AlignRight = 'alignRight';
    case Hash = 'hash';
    case Code = 'code';
    case Terminal = 'terminal';

    // Actions
    case Minus = 'minus';
    case Search = 'search';
    case ZoomIn = 'zoomIn';
    case ZoomOut = 'zoomOut';
    case Filter = 'filter';
    case Refresh = 'refresh';
    case Undo = 'undo';
    case Redo = 'redo';
    case History = 'history';
    case Share = 'share';
    case ExternalLink = 'externalLink';
    case LogIn = 'logIn';
    case LogOut = 'logOut';
    case Power = 'power';
    case Settings = 'settings';
    case MoreHorizontal = 'moreHorizontal';
    case MoreVertical = 'moreVertical';
    case Menu = 'menu';
    case Grid = 'grid';
    case List = 'list';
    case Eye = 'eye';
    case EyeOff = 'eyeOff';
    case Heart = 'heart';
    case Star = 'star';
    case Tag = 'tag';
    case Zap = 'zap';
    case MousePointer = 'mousePointer';
    case Move = 'move';
    case Maximize = 'maximize';
    case Minimize = 'minimize';
    case Ban = 'ban';

    // Arrows
    case ArrowUp = 'arrowUp';
    case ArrowDown = 'arrowDown';
    case ArrowUpRight = 'arrowUpRight';
    case ArrowDownLeft = 'arrowDownLeft';
    case ChevronsUp = 'chevronsUp';
    case ChevronsDown = 'chevronsDown';
    case Repeat = 'repeat';

    // Status and controls
    case CircleAlert = 'circleAlert';
    case CircleHelp = 'circleHelp';
    case CirclePlus = 'circlePlus';
    case CircleMinus = 'circleMinus';
    case CheckSquare = 'checkSquare';
    case Square = 'square';
    case Circle = 'circle';
    case ToggleLeft = 'toggleLeft';
    case ToggleRight = 'toggleRight';

    // Commerce
    case ShoppingCart = 'shoppingCart';
    case ShoppingBag = 'shoppingBag';
    case Package = 'package';
    case Truck = 'truck';
    case Receipt = 'receipt';
    case Wallet = 'wallet';
    case Banknote = 'banknote';
    case DollarSign = 'dollarSign';
    case Percent = 'percent';
    case Gift = 'gift';
    case Calculator = 'calculator';
    case Landmark = 'landmark';
    case Ticket = 'ticket';
    case Crown = 'crown';
    case Gem = 'gem';

    // Time
    case CalendarCheck = 'calendarCheck';
    case CalendarPlus = 'calendarPlus';
    case Hourglass = 'hourglass';

    // Places
    case Globe = 'globe';
    case Map = 'map';
    case Building = 'building';
    case Navigation = 'navigation';
    case Compass = 'compass';
    case Anchor = 'anchor';

    // Devices
    case Monitor = 'monitor';
    case Laptop = 'laptop';
    case Smartphone = 'smartphone';
    case Tablet = 'tablet';
    case Keyboard = 'keyboard';
    case Server = 'server';
    case Database = 'database';
    case Cloud = 'cloud';
    case Wifi = 'wifi';
    case Signal = 'signal';
    case Battery = 'battery';
    case Cpu = 'cpu';
    case HardDrive = 'hardDrive';

    // Media
    case Image = 'image';
    case Camera = 'camera';
    case Video = 'video';
    case Music = 'music';
    case Mic = 'mic';
    case Volume = 'volume';
    case VolumeX = 'volumeX';
    case Play = 'play';
    case Pause = 'pause';
    case Stop = 'stop';
    case Headphones = 'headphones';

    // Security
    case Key = 'key';
    case Unlock = 'unlock';
    case ShieldCheck = 'shieldCheck';

    // Nature and ideas
    case Sun = 'sun';
    case Moon = 'moon';
    case Droplet = 'droplet';
    case Leaf = 'leaf';
    case Lightbulb = 'lightbulb';
    case Rocket = 'rocket';
    case Sparkles = 'sparkles';
    case Target = 'target';
    case Award = 'award';
    case Trophy = 'trophy';
    case GraduationCap = 'graduationCap';
    case Coffee = 'coffee';
    case Palette = 'palette';

    // Charts and layout
    case BarChart = 'barChart';
    case LineChart = 'lineChart';
    case PieChart = 'pieChart';
    case TrendingUp = 'trendingUp';
    case TrendingDown = 'trendingDown';
    case Activity = 'activity';
    case Layout = 'layout';
    case Sidebar = 'sidebar';
    case Columns = 'columns';
    case Table = 'table';
    case Layers = 'layers';

    // Shapes
    case Triangle = 'triangle';
    case Diamond = 'diamond';
    case Hexagon = 'hexagon';
    case Octagon = 'octagon';

    /**
     * The SVG path `d` value of the icon.
     */
    public function path(): string
    {
        return match ($this) {
            // People
            self::Users => 'M5.5 8a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0M2 20v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M16 4.5a3.5 3.5 0 0 1 0 7M22 20v-1a5 5 0 0 0-3.5-4.8',
            self::UserPlus => 'M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M5 8a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M19 8v6M16 11h6',
            self::UserMinus => 'M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M5 8a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M16 11h6',
            self::UserCheck => 'M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M5 8a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M16 11l2 2 4-4',
            self::UserX => 'M2 21v-1a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v1M5 8a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M17 8.5l5 5M22 8.5l-5 5',
            self::UserCircle => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M6.2 18.4a7 7 0 0 1 11.6 0',
            self::IdCard => 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2zM6 11a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M5 16a3 3 0 0 1 6 0M14 10h5M14 14h3',
            self::Smile => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M8 14a4 4 0 0 0 8 0M9 9.5h.01M15 9.5h.01',
            self::Frown => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M16 16.5a4 4 0 0 0-8 0M9 9.5h.01M15 9.5h.01',
            // Communication
            self::Phone => 'M5 3h3.5l2 5-2.5 1.8a12 12 0 0 0 6.2 6.2L16 13.5l5 2V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2z',
            self::MessageCircle => 'M21 11.5a8.5 8.5 0 0 1-12.4 7.6L3 21l1.9-5.6A8.5 8.5 0 1 1 21 11.5z',
            self::MessageSquare => 'M6 4h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-5 4V6a2 2 0 0 1 2-2z',
            self::Inbox => 'M3 13h5l1.5 3h5l1.5-3h5M3 13l3-8h12l3 8v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
            self::AtSign => 'M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8',
            self::Bell => 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a2 2 0 0 0 3.4 0',
            self::BellOff => 'M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a2 2 0 0 0 3.4 0M3 3l18 18',
            self::Megaphone => 'M3 10v4a1 1 0 0 0 1 1h3l8 5V4L7 9H4a1 1 0 0 0-1 1zM19 9a3 3 0 0 1 0 6M7 15l1 5h3l-1-4.5',
            self::Rss => 'M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16M4 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
            // Files
            self::File => 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6',
            self::FilePlus => 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M12 12v6M9 15h6',
            self::FileCheck => 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M9 15l2 2 4-4',
            self::Folder => 'M3 6a2 2 0 0 1 2-2h4l2 3h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
            self::FolderOpen => 'M5 19a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4l2 3h6a2 2 0 0 1 2 2v2M3 19l3.5-8H22l-3.5 8z',
            self::Clipboard => 'M7 4h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2zM9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1z',
            self::ClipboardCheck => 'M7 4h10a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2zM9 2h6a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-6a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1zM9 14l2 2 4-4',
            self::Download => 'M12 3v12M7 10l5 5 5-5M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
            self::Archive => 'M3 4h18a1 1 0 0 1 1 1v3a1 1 0 0 1 -1 1h-18a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1zM4 9v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9M10 13h4',
            self::Printer => 'M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8h-12z',
            self::Book => 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20V2H6.5A2.5 2.5 0 0 0 4 4.5zM4 19.5A2.5 2.5 0 0 0 6.5 22H20v-5',
            self::BookOpen => 'M2 5h6a4 4 0 0 1 4 4v12a3 3 0 0 0-3-3H2zM22 5h-6a4 4 0 0 0-4 4v12a3 3 0 0 1 3-3h7z',
            self::Bookmark => 'M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z',
            // Text and code
            self::Pencil => 'M16 3l5 5L8 21H3v-5zM13 6l5 5',
            self::Scissors => 'M3 6a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M3 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M8.1 8.1L20 20M8.1 15.9L20 4',
            self::Type => 'M4 7V4h16v3M9 20h6M12 4v16',
            self::Bold => 'M7 4h7a4 4 0 0 1 0 8H7zM7 12h8a4 4 0 0 1 0 8H7z',
            self::Italic => 'M19 4h-9M14 20H5M15 4L9 20',
            self::Underline => 'M6 4v6a6 6 0 0 0 12 0V4M4 21h16',
            self::Heading => 'M6 4v16M18 4v16M6 12h12',
            self::AlignLeft => 'M3 6h18M3 12h12M3 18h16',
            self::AlignCenter => 'M3 6h18M6 12h12M4 18h16',
            self::AlignRight => 'M3 6h18M9 12h12M5 18h16',
            self::Hash => 'M4 9h16M4 15h16M10 3L8 21M16 3l-2 18',
            self::Code => 'M16 18l6-6-6-6M8 6l-6 6 6 6',
            self::Terminal => 'M4 17l6-6-6-6M12 19h8',
            // Actions
            self::Minus => 'M5 12h14',
            self::Search => 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0 -14 0M21 21l-5-5',
            self::ZoomIn => 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0 -14 0M21 21l-5-5M11 8v6M8 11h6',
            self::ZoomOut => 'M4 11a7 7 0 1 0 14 0a7 7 0 1 0 -14 0M21 21l-5-5M8 11h6',
            self::Filter => 'M3 4h18l-7 8.5V19l-4 2v-8.5z',
            self::Refresh => 'M21 12a9 9 0 0 1-15.5 6.2M3 12a9 9 0 0 1 15.5-6.2M18.5 2v4h-4M5.5 22v-4h4',
            self::Undo => 'M3 12a9 9 0 1 0 2.6-6.4L3 8M3 3v5h5',
            self::Redo => 'M21 12a9 9 0 1 1-2.6-6.4L21 8M21 3v5h-5',
            self::History => 'M3 12a9 9 0 1 0 2.6-6.4L3 8M3 3v5h5M12 7v5l3 2',
            self::Share => 'M15 5a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M3 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M15 19a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M8.6 13.5l6.8 4M15.4 6.5l-6.8 4',
            self::ExternalLink => 'M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6',
            self::LogIn => 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3',
            self::LogOut => 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
            self::Power => 'M12 2v10M18.4 6.6a9 9 0 1 1-12.8 0',
            self::Settings => 'M19.39 10.23L21.92 10.75L21.92 13.25L19.39 13.77L18.48 15.97L19.9 18.13L18.13 19.9L15.97 18.48L13.77 19.39L13.25 21.92L10.75 21.92L10.23 19.39L8.03 18.48L5.87 19.9L4.1 18.13L5.52 15.97L4.61 13.77L2.08 13.25L2.08 10.75L4.61 10.23L5.52 8.03L4.1 5.87L5.87 4.1L8.03 5.52L10.23 4.61L10.75 2.08L13.25 2.08L13.77 4.61L15.97 5.52L18.13 4.1L19.9 5.87L18.48 8.03zM9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
            self::MoreHorizontal => 'M4 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M18 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
            self::MoreVertical => 'M11 5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M11 19a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
            self::Menu => 'M4 6h16M4 12h16M4 18h16',
            self::Grid => 'M4 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1zM15 3h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1zM4 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1zM15 14h5a1 1 0 0 1 1 1v5a1 1 0 0 1 -1 1h-5a1 1 0 0 1 -1 -1v-5a1 1 0 0 1 1 -1z',
            self::List => 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
            self::Eye => 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
            self::EyeOff => 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM9 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M3 3l18 18',
            self::Heart => 'M12 20s-8-4.8-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6.2-8 11-8 11z',
            self::Star => 'M12 2.6L14.47 9.2L21.51 9.51L15.99 13.9L17.88 20.69L12 16.8L6.12 20.69L8.01 13.9L2.49 9.51L9.53 9.2z',
            self::Tag => 'M3 3h8l10 10-8 8L3 11zM6.5 7.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
            self::Zap => 'M13 2L4 14h7l-1 8 9-12h-7z',
            self::MousePointer => 'M4 3l7 17 2.5-7.5L21 10z',
            self::Move => 'M12 2v20M2 12h20M9 5l3-3 3 3M9 19l3 3 3-3M5 9l-3 3 3 3M19 9l3 3-3 3',
            self::Maximize => 'M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3',
            self::Minimize => 'M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3',
            self::Ban => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M4.9 4.9l14.2 14.2',
            // Arrows
            self::ArrowUp => 'M12 19V5M5 12l7-7 7 7',
            self::ArrowDown => 'M12 5v14M19 12l-7 7-7-7',
            self::ArrowUpRight => 'M7 17L17 7M7 7h10v10',
            self::ArrowDownLeft => 'M17 7L7 17M17 17H7V7',
            self::ChevronsUp => 'M17 11l-5-5-5 5M17 18l-5-5-5 5',
            self::ChevronsDown => 'M7 13l5 5 5-5M7 6l5 5 5-5',
            self::Repeat => 'M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3',
            // Status and controls
            self::CircleAlert => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M12 8v4M12 16h.01',
            self::CircleHelp => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01',
            self::CirclePlus => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M12 8v8M8 12h8',
            self::CircleMinus => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M8 12h8',
            self::CheckSquare => 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2zM8 12l3 3 5-6',
            self::Square => 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2z',
            self::Circle => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0',
            self::ToggleLeft => 'M8 6h8a6 6 0 0 1 6 6v0a6 6 0 0 1 -6 6h-8a6 6 0 0 1 -6 -6v0a6 6 0 0 1 6 -6zM5 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
            self::ToggleRight => 'M8 6h8a6 6 0 0 1 6 6v0a6 6 0 0 1 -6 6h-8a6 6 0 0 1 -6 -6v0a6 6 0 0 1 6 -6zM13 12a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
            // Commerce
            self::ShoppingCart => 'M7 21a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M18 21a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M2 2h3l2.7 12.4a2 2 0 0 0 2 1.6h8.8a2 2 0 0 0 2-1.6L22 7H6',
            self::ShoppingBag => 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0',
            self::Package => 'M12 2l9 5v10l-9 5-9-5V7zM3 7l9 5 9-5M12 12v10M7.5 4.5l9 5',
            self::Truck => 'M1 4h14v12h-14zM15 9h4l3 3v4h-7M3.5 18.5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M16.5 18.5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
            self::Receipt => 'M5 2v20l2.3-1.5L9.7 22l2.3-1.5 2.3 1.5 2.4-1.5L19 22V2l-2.3 1.5L14.3 2 12 3.5 9.7 2 7.3 3.5zM9 9h6M9 13h6',
            self::Wallet => 'M20 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3v4a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2V5',
            self::Banknote => 'M4 6h16a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2zM9.5 12a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0M6 12h.01M18 12h.01',
            self::DollarSign => 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
            self::Percent => 'M19 5L5 19M4 6.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0M15 17.5a2.5 2.5 0 1 0 5 0a2.5 2.5 0 1 0 -5 0',
            self::Gift => 'M4 8h16a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-16a1 1 0 0 1 -1 -1v-2a1 1 0 0 1 1 -1zM12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5',
            self::Calculator => 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-16a2 2 0 0 1 2 -2zM8 6h8v4h-8zM8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01',
            self::Landmark => 'M3 21h18M4 18h16M6 18v-7M10 18v-7M14 18v-7M18 18v-7M3 10h18L12 4z',
            self::Ticket => 'M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4zM13 5v2M13 11v2M13 17v2',
            self::Crown => 'M3 18L2 7l5 4 5-7 5 7 5-4-1 11zM4 21h16',
            self::Gem => 'M6 3h12l4 6-10 12L2 9zM2 9h20M12 21L8 9l3-6M12 21l4-12-3-6',
            // Time
            self::CalendarCheck => 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2zM16 2v4M8 2v4M3 10h18M9 16l2 2 4-4',
            self::CalendarPlus => 'M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2zM16 2v4M8 2v4M3 10h18M12 13v6M9 16h6',
            self::Hourglass => 'M5 22h14M5 2h14M17 22v-4.2a2 2 0 0 0-.6-1.4L12 12l-4.4 4.4a2 2 0 0 0-.6 1.4V22M7 2v4.2a2 2 0 0 0 .6 1.4L12 12l4.4-4.4a2 2 0 0 0 .6-1.4V2',
            // Places
            self::Globe => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z',
            self::Map => 'M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15',
            self::Building => 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-16a2 2 0 0 1 2 -2zM9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01',
            self::Navigation => 'M3 11L22 2l-9 19-2-8z',
            self::Compass => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M16.2 7.8l-2.1 6.3-6.3 2.1 2.1-6.3z',
            self::Anchor => 'M10 5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M12 7v14M5 12H3a9 9 0 0 0 18 0h-2M8 11h8',
            // Devices
            self::Monitor => 'M4 3h16a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2zM8 21h8M12 17v4',
            self::Laptop => 'M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-14a1 1 0 0 1 -1 -1v-10a1 1 0 0 1 1 -1zM2 20h20',
            self::Smartphone => 'M8 2h8a2 2 0 0 1 2 2v16a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2v-16a2 2 0 0 1 2 -2zM12 18h.01',
            self::Tablet => 'M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-16a2 2 0 0 1 2 -2zM12 18h.01',
            self::Keyboard => 'M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2zM6 9h.01M10 9h.01M14 9h.01M18 9h.01M6 12.5h.01M10 12.5h.01M14 12.5h.01M18 12.5h.01M7 16h10',
            self::Server => 'M4 2h16a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2zM4 14h16a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-16a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2zM6 6h.01M6 18h.01',
            self::Database => 'M3 5a9 3 0 1 0 18 0a9 3 0 1 0-18 0M3 5v14a9 3 0 0 0 18 0V5M3 12a9 3 0 0 0 18 0',
            self::Cloud => 'M17.5 19H7a5 5 0 1 1 1.3-9.8A6 6 0 0 1 20 11a4 4 0 0 1-2.5 8z',
            self::Wifi => 'M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0M2 8.8a15 15 0 0 1 20 0M12 20h.01',
            self::Signal => 'M4 20v-3M9 20v-7M14 20V9M19 20V4',
            self::Battery => 'M4 7h12a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-6a2 2 0 0 1 2 -2zM22 11v2M6 10v4M10 10v4',
            self::Cpu => 'M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2zM10 9h4a1 1 0 0 1 1 1v4a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1v-4a1 1 0 0 1 1 -1zM9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3',
            self::HardDrive => 'M22 12H2M5.5 5.1L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.8 4H7.2a2 2 0 0 0-1.7 1.1zM6 16h.01M10 16h.01',
            // Media
            self::Image => 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2zM7 9a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M21 15l-5-5L5 21',
            self::Camera => 'M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3zM8.5 13a3.5 3.5 0 1 0 7 0a3.5 3.5 0 1 0 -7 0',
            self::Video => 'M4 6h10a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-8a2 2 0 0 1 2 -2zM16 10.5L22 7v10l-6-3.5',
            self::Music => 'M9 18V5l12-2v13M3 18a3 3 0 1 0 6 0a3 3 0 1 0 -6 0M15 16a3 3 0 1 0 6 0a3 3 0 1 0 -6 0',
            self::Mic => 'M12 2h0a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3v-6a3 3 0 0 1 3 -3zM19 10v1a7 7 0 0 1-14 0v-1M12 18v4M8 22h8',
            self::Volume => 'M11 5L6 9H2v6h4l5 4zM15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14',
            self::VolumeX => 'M11 5L6 9H2v6h4l5 4zM22 9l-6 6M16 9l6 6',
            self::Play => 'M6 3l14 9-14 9z',
            self::Pause => 'M7 4h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1zM15 4h2a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-14a1 1 0 0 1 1 -1z',
            self::Stop => 'M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2z',
            self::Headphones => 'M3 18v-6a9 9 0 0 1 18 0v6M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z',
            // Security
            self::Key => 'M3 15.5a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0M10.7 12.3L21 2M17 6l3 3M14.5 8.5l2 2',
            self::Unlock => 'M5 11h14a2 2 0 0 1 2 2v7a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-7a2 2 0 0 1 2 -2zM7 11V7a5 5 0 0 1 9.9-1',
            self::ShieldCheck => 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4',
            // Nature and ideas
            self::Sun => 'M8 12a4 4 0 1 0 8 0a4 4 0 1 0 -8 0M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M6.3 17.7l-1.4 1.4M19.1 4.9l-1.4 1.4',
            self::Moon => 'M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z',
            self::Droplet => 'M12 2.7l5.7 5.7a8 8 0 1 1-11.3 0z',
            self::Leaf => 'M5 19C5 10 10 4 20 4c0 10-6 15-15 15zM5 19l9-9',
            self::Lightbulb => 'M9 18h6M10 22h4M8 14.5A6 6 0 1 1 16 14.5c-.8.7-1 1.5-1 2.5v1H9v-1c0-1-.3-1.8-1-2.5z',
            self::Rocket => 'M12 2c3 2 5 5.5 5 10v4H7v-4c0-4.5 2-8 5-10zM7 12l-3 3v4l3-1.5M17 12l3 3v4l-3-1.5M10 19l2 3 2-3M10.5 9.5a1.5 1.5 0 1 0 3 0a1.5 1.5 0 1 0 -3 0',
            self::Sparkles => 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 3v4M17 5h4',
            self::Target => 'M2 12a10 10 0 1 0 20 0a10 10 0 1 0 -20 0M6 12a6 6 0 1 0 12 0a6 6 0 1 0 -12 0M10 12a2 2 0 1 0 4 0a2 2 0 1 0 -4 0',
            self::Award => 'M6 9a6 6 0 1 0 12 0a6 6 0 1 0 -12 0M8.5 13.9L7 22l5-3 5 3-1.5-8.1',
            self::Trophy => 'M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3',
            self::GraduationCap => 'M2 9l10-5 10 5-10 5zM6 11v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 9v6',
            self::Coffee => 'M4 8h13v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5zM17 9h1.5a2.5 2.5 0 0 1 0 5H17M8 2v3M12 2v3',
            self::Palette => 'M12 22a10 10 0 1 1 10-10c0 2.2-1.8 3-4 3h-2a2 2 0 0 0-1 3.7A2 2 0 0 1 12 22zM6.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M11 7a1 1 0 1 0 2 0a1 1 0 1 0 -2 0M15.5 10.5a1 1 0 1 0 2 0a1 1 0 1 0 -2 0',
            // Charts and layout
            self::BarChart => 'M3 3v18h18M8 17v-5M13 17V8M18 17v-8',
            self::LineChart => 'M3 3v18h18M7 15l4-4 3 3 6-6',
            self::PieChart => 'M21 12A9 9 0 1 1 12 3v9zM15 3.5A8.5 8.5 0 0 1 20.5 9H15z',
            self::TrendingUp => 'M3 17l6-6 4 4 8-8M15 7h6v6',
            self::TrendingDown => 'M3 7l6 6 4-4 8 8M15 17h6v-6',
            self::Activity => 'M3 12h4l3-8 4 16 3-8h4',
            self::Layout => 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2zM3 9h18M9 21V9',
            self::Sidebar => 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2zM9 3v18',
            self::Columns => 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2zM12 3v18',
            self::Table => 'M5 3h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2zM3 9h18M3 15h18M12 9v12',
            self::Layers => 'M12 3l9 5-9 5-9-5zM3 12.5l9 5 9-5M3 16.5l9 5 9-5',
            // Shapes
            self::Triangle => 'M12 3l10 17H2z',
            self::Diamond => 'M12 2l10 10-10 10L2 12z',
            self::Hexagon => 'M12 2L20.66 7L20.66 17L12 22L3.34 17L3.34 7z',
            self::Octagon => 'M8.17 2.76L15.83 2.76L21.24 8.17L21.24 15.83L15.83 21.24L8.17 21.24L2.76 15.83L2.76 8.17z',
        };
    }

    /**
     * The group the icon is listed under in the docs.
     */
    public function category(): string
    {
        return match ($this) {
            self::Users, self::UserPlus, self::UserMinus, self::UserCheck, self::UserX, self::UserCircle, self::IdCard, self::Smile, self::Frown => 'People',
            self::Phone, self::MessageCircle, self::MessageSquare, self::Inbox, self::AtSign, self::Bell, self::BellOff, self::Megaphone, self::Rss => 'Communication',
            self::File, self::FilePlus, self::FileCheck, self::Folder, self::FolderOpen, self::Clipboard, self::ClipboardCheck, self::Download, self::Archive, self::Printer, self::Book, self::BookOpen, self::Bookmark => 'Files',
            self::Pencil, self::Scissors, self::Type, self::Bold, self::Italic, self::Underline, self::Heading, self::AlignLeft, self::AlignCenter, self::AlignRight, self::Hash, self::Code, self::Terminal => 'Text and code',
            self::Minus, self::Search, self::ZoomIn, self::ZoomOut, self::Filter, self::Refresh, self::Undo, self::Redo, self::History, self::Share, self::ExternalLink, self::LogIn, self::LogOut, self::Power, self::Settings, self::MoreHorizontal, self::MoreVertical, self::Menu, self::Grid, self::List, self::Eye, self::EyeOff, self::Heart, self::Star, self::Tag, self::Zap, self::MousePointer, self::Move, self::Maximize, self::Minimize, self::Ban => 'Actions',
            self::ArrowUp, self::ArrowDown, self::ArrowUpRight, self::ArrowDownLeft, self::ChevronsUp, self::ChevronsDown, self::Repeat => 'Arrows',
            self::CircleAlert, self::CircleHelp, self::CirclePlus, self::CircleMinus, self::CheckSquare, self::Square, self::Circle, self::ToggleLeft, self::ToggleRight => 'Status and controls',
            self::ShoppingCart, self::ShoppingBag, self::Package, self::Truck, self::Receipt, self::Wallet, self::Banknote, self::DollarSign, self::Percent, self::Gift, self::Calculator, self::Landmark, self::Ticket, self::Crown, self::Gem => 'Commerce',
            self::CalendarCheck, self::CalendarPlus, self::Hourglass => 'Time',
            self::Globe, self::Map, self::Building, self::Navigation, self::Compass, self::Anchor => 'Places',
            self::Monitor, self::Laptop, self::Smartphone, self::Tablet, self::Keyboard, self::Server, self::Database, self::Cloud, self::Wifi, self::Signal, self::Battery, self::Cpu, self::HardDrive => 'Devices',
            self::Image, self::Camera, self::Video, self::Music, self::Mic, self::Volume, self::VolumeX, self::Play, self::Pause, self::Stop, self::Headphones => 'Media',
            self::Key, self::Unlock, self::ShieldCheck => 'Security',
            self::Sun, self::Moon, self::Droplet, self::Leaf, self::Lightbulb, self::Rocket, self::Sparkles, self::Target, self::Award, self::Trophy, self::GraduationCap, self::Coffee, self::Palette => 'Nature and ideas',
            self::BarChart, self::LineChart, self::PieChart, self::TrendingUp, self::TrendingDown, self::Activity, self::Layout, self::Sidebar, self::Columns, self::Table, self::Layers => 'Charts and layout',
            self::Triangle, self::Diamond, self::Hexagon, self::Octagon => 'Shapes',
        };
    }

    /**
     * Every icon as name => path `d` value.
     *
     * @return array<string, string>
     */
    public static function paths(): array
    {
        $paths = [];

        foreach (self::cases() as $icon) {
            $paths[$icon->value] = $icon->path();
        }

        return $paths;
    }

    /**
     * Every icon grouped by category, as category => name => path `d` value.
     *
     * @return array<string, array<string, string>>
     */
    public static function grouped(): array
    {
        $groups = [];

        foreach (self::cases() as $icon) {
            $groups[$icon->category()][$icon->value] = $icon->path();
        }

        return $groups;
    }
}
