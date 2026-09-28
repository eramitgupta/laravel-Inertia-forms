<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Unauthorized Forms
    |--------------------------------------------------------------------------
    |
    | When a whole form is not authorized, it serializes to an empty structure.
    | Enable this option to throw an AuthorizationException instead.
    |
    */

    'throw_on_unauthorized' => false,

    /*
    |--------------------------------------------------------------------------
    | Remote Select Search
    |--------------------------------------------------------------------------
    |
    | Selects that use searchUsing() load their options from this endpoint.
    | The request carries an encrypted form class, so only your form classes
    | can be queried. Add auth middleware here if the options are private.
    |
    */

    'search' => [
        'uri' => '_inertia-forms/search',
        'middleware' => ['web', 'throttle:60,1'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Wizard Step Validation
    |--------------------------------------------------------------------------
    |
    | Wizard forms check each step on the server before moving on. The request
    | carries an encrypted form class, like the search endpoint.
    |
    */

    'wizard' => [
        'uri' => '_inertia-forms/validate-step',
        'middleware' => ['web', 'throttle:60,1'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Icons
    |--------------------------------------------------------------------------
    |
    | Your own icons for icon(), as name => SVG. Use the inside of a 24×24
    | stroke icon, a bare path "d" value, or a full <svg> element. A name
    | that already exists replaces the package's icon.
    |
    | 'icons' => [
    |     'bolt' => '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    | ],
    |
    */

    'icons' => [],

];
