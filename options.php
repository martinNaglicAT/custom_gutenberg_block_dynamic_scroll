<?php 

//settings 

//register settings page
add_action('admin_menu', 'dynamic_banner_menu');

function dynamic_banner_menu() {
    add_options_page(
        'Dynamic Banner Options', // page_title
        'Dynamic Banner', // menu_title
        'manage_options', // capability
        'dynamic-banner', // menu_slug
        'dynamic_banner_options_page' // function
    );
}

//settings callback
function dynamic_banner_options_page() {
    settings_errors();
    ?>
    <div class="wrap">
        <h1>Dynamic Banner Fonts</h1>
        <form action="options.php" method="post">
            <?php
            settings_fields('dynamic_banner_options_group');
            do_settings_sections('dynamic-banner');
            submit_button();
            ?>
        </form>
    </div>
    <?php
}


//register settings, sections and fields
function dynamic_banner_register_settings() {
    // Register a setting
    register_setting(
        'dynamic_banner_options_group', // Option group
        'dynamic_banner_fonts', // Option name
        'dynamic_banner_sanitize_fonts' // Sanitize callback
    );


    // Add a settings section
    add_settings_section(
        'dynamic_banner_fonts_section', // ID
        'Add Custom Fonts', // Title
        'dynamic_banner_fonts_section_callback', // Callback
        'dynamic-banner' // Page
    );

/*
    // Register the font URL setting
    register_setting('dynamic_banner_options_group', 'dynamic_banner_font_link', 'sanitize_font_link');

    add_settings_section(
        'dynamic_banner_fonts_import_section', // ID
        'Import additional fonts', // Title
        'dynamic_banner_import_fonts_section_callback', // Callback
        'dynamic-banner' // Page
    );

*/
}
add_action('admin_init', 'dynamic_banner_register_settings');

function dynamic_banner_fonts_section_callback() {
    $fonts = get_option('dynamic_banner_fonts', array());
    
    // Display existing fonts for editing
    if($fonts) {
        echo '<h2>Existing Fonts:</h2>';
        echo '<ul>';
        foreach ($fonts as $font_id => $font) {
            $nonce = wp_create_nonce('remove_font_' . $font_id);
            echo '<li>';
            echo "<input type='text' name='dynamic_banner_fonts[{$font_id}][font_name]' value='" . esc_attr($font['font_name']) . "'>";
            echo "<input type='text' name='dynamic_banner_fonts[{$font_id}][font_tag]' value='" . esc_attr($font['font_tag']) . "'>";
            echo "<input type='text' name='dynamic_banner_fonts[{$font_id}][font_style]' value='" . esc_attr($font['font_style']) . "'>";
            
            /// Font Weights
            echo '<label>Font Weights:</label>';
            $weights = array(100, 200, 300, 400, 500, 600, 700, 800, 900);
            foreach ($weights as $weight) {
                $isChecked = in_array($weight, $font['font_weights'] ?? array()) ? "checked" : "";
                echo "<input type='checkbox' name='dynamic_banner_fonts[{$font_id}][font_weights][]' value='{$weight}' {$isChecked} /> {$weight} ";
            }

            // Font Style
            echo '<br/><label>Italic:</label>';
            $isItalicChecked = ($font['font_style_italic'] ?? '') === 'italic' ? "checked" : "";
            echo "<input type='checkbox' name='dynamic_banner_fonts[{$font_id}][font_style_italic]' value='italic' {$isItalicChecked} /> Italic";

            echo " <a href='?remove_font={$font_id}&_wpnonce={$nonce}'>Remove</a>";
            echo "</li>";
        }
        echo '</ul>';
    } else {
        echo "You haven't added any fonts yet.";
    }

    // Display a blank input set for adding new fonts
    echo '<div class="add-new-font">';
    echo "<input type='text' name='dynamic_banner_fonts[new][font_name]' placeholder='Enter new font name'>";
    echo "<input type='text' name='dynamic_banner_fonts[new][font_tag]' placeholder='Enter new font tag'>";
    echo "<input type='text' name='dynamic_banner_fonts[new][font_style]' placeholder='Enter new font style'>";
    // Font Weights
    echo '<label>Font Weights:</label>';
    $weights = array(100, 200, 300, 400, 500, 600, 700, 800, 900);
    foreach ($weights as $weight) {
        echo "<input type='checkbox' name='font_weights[]' value='{$weight}' " . (in_array($weight, get_option('dynamic_banner_font_weights', array())) ? "checked" : "") . " /> {$weight} ";
    }

    // Font Style
    echo '<br/><label>Italic:</label>';
    echo "<input type='checkbox' name='font_style_italic' value='italic' " . (get_option('dynamic_banner_font_style_italic') === 'italic' ? "checked" : "") . " /> Italic";
    echo '</div>';
}


function handle_font_removal() {
    if (isset($_GET['remove_font']) && isset($_GET['_wpnonce'])) {
        $font_id = sanitize_text_field($_GET['remove_font']);

        if (wp_verify_nonce($_GET['_wpnonce'], 'remove_font_' . $font_id)) {
            $current_fonts = get_option('dynamic_banner_fonts', array());

            if (isset($current_fonts[$font_id])) {
                unset($current_fonts[$font_id]);
            } else {
                return; // exit early since there's no font to remove
            }

            // Update the option with the modified fonts array
            $old_fonts = get_option('dynamic_banner_fonts', array());
            if ($old_fonts !== $current_fonts) {
                update_option('dynamic_banner_fonts', $current_fonts);
            }

            // Redirecting to the settings page after removal
            $redirect_url = admin_url('options-general.php?page=dynamic-banner');
            wp_redirect($redirect_url);
            exit;
        }
    }
}
add_action('admin_init', 'handle_font_removal');



function dynamic_banner_sanitize_fonts($input) {
    $output = array();  // Start with an empty array instead of the old fonts

    foreach ($input as $font_id => $font) {
        $newFont = array(); 

        // Sanitize font_name
        if (isset($font['font_name']) && preg_match('/^[a-zA-Z ]+$/', $font['font_name'])) {
            $newFont['font_name'] = sanitize_text_field($font['font_name']);
        }

        // Sanitize font_tag
        if (isset($font['font_tag']) && preg_match('/^[a-zA-Z-_]+$/', $font['font_tag'])) {
            $newFont['font_tag'] = sanitize_text_field($font['font_tag']);
        }

        // Sanitize font_style
        if (isset($font['font_style']) && preg_match('/^[a-zA-Z ,\-"\']+$/', $font['font_style'])) {
            $newFont['font_style'] = sanitize_text_field($font['font_style']);
        }

        // Sanitize font weights
        if (isset($font['font_weights']) && is_array($font['font_weights'])) {
            $newFont['font_weights'] = array_map('intval', $font['font_weights']); // Convert to integer values
            $newFont['font_weights'] = array_filter($newFont['font_weights'], function($weight) {
                return in_array($weight, array(100, 200, 300, 400, 500, 600, 700, 800, 900)); // Ensure valid weights only
            });
        } else {
            $newFont['font_weights'] = array();
        }

        // Sanitize italic font style
        $newFont['font_style_italic'] = (isset($font['font_style_italic']) && $font['font_style_italic'] === 'italic') ? 'italic' : '';

        // If this is a new font and it's empty, ignore it
        if ($font_id == 'new' && empty($newFont['font_name']) && empty($newFont['font_tag']) && empty($newFont['font_style'])) {
            continue;  // Skip this iteration of the loop
        }

        // If this is a new font, assign it a unique ID
        if ($font_id == 'new') {
            $font_id = uniqid();
        }

        $output[$font_id] = $newFont;
    }

    return $output;
}


function add_dynamic_banner_settings_link( $links ) {
    $settings_link = '<a href="options-general.php?page=dynamic-banner">' . __( 'Settings' ) . '</a>';
    array_push( $links, $settings_link );
    return $links;
}

$plugin = 'mn-custom-block-dynamic-banner/mn-custom-block-dynamic-banner.php'; 
add_filter( "plugin_action_links_$plugin", 'add_dynamic_banner_settings_link' );



