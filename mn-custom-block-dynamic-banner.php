<?php
/**
 * Plugin Name: MN Custom Block Dynamic Banner
 */

require_once plugin_dir_path(__FILE__) . 'options.php';

function gutenberg_dynamic_banner_register_block_script() {
    $block_script_path = plugin_dir_url(__FILE__) . 'build/index.js';
    $block_script_version = filemtime(plugin_dir_path(__FILE__) . 'build/index.js'); 

    // Register the script
    wp_register_script(
        'mn-custom-block-dynamic-banner-script', 
        $block_script_path, 
        array('wp-blocks', 'wp-element', 'wp-editor', 'wp-rich-text', 'wp-components'), 
        $block_script_version,
        true
    );

    // Localize the script with the fonts data
    $fonts = get_option('dynamic_banner_fonts', array());
    //error_log(print_r($fonts, true));
    wp_localize_script( 'mn-custom-block-dynamic-banner-script', 'dynamicBannerFonts', $fonts );

}
add_action('init', 'gutenberg_dynamic_banner_register_block_script', 9);

function gutenberg_dynamic_banner_register_block() {
    // Ensure our script is registered
    gutenberg_dynamic_banner_register_block_script();
    
    // Enqueue the script
    wp_enqueue_script('mn-custom-block-dynamic-banner-script');

    // Register the block
    register_block_type(
        __DIR__,
        array(
            'editor_script' => 'mn-custom-block-dynamic-banner-script', // Use the script handle
        )
    );
}
add_action('init', 'gutenberg_dynamic_banner_register_block', 10);


//Enqueue all added fonts in the admin gutenberg editor so that they can be previewed
function enqueue_admin_fonts() {
    global $pagenow;

    // Check if the current page is the post editor
    if ($pagenow != 'post.php' && $pagenow != 'post-new.php') {
        return;
    }

    $current_screen = get_current_screen();
    if ($current_screen->post_type != 'post') {
        return;
    }

    // Fetch the dynamic_banner_fonts option from the database.
    $fonts_option = get_option('dynamic_banner_fonts', array());

    $font_url = 'https://fonts.googleapis.com/css2?';
    $all_fonts = [];

    foreach ($fonts_option as $font) {
        $font_name = isset($font['font_name']) ? $font['font_name'] : '';
        
        // Transform font name
        $font_name_transformed = str_replace(' ', '+', ucfirst($font_name));
        
        $current_font = 'family=' . $font_name_transformed . ":";

        if (isset($font['font_style_italic']) && $font['font_style_italic'] === 'italic') {
            $current_font .= 'ital,';

            if (isset($font['font_weights']) && !empty($font['font_weights'])) {
                $weightItalics = [];
                $weightNormals = [];

                foreach($font['font_weights'] as $weight){
                    $weightItalics[] = '0,'.$weight;
                    $weightNormals[] = '1,'.$weight;
                }
                $weightString = implode(';', $weightItalics) . ';' . implode(';', $weightNormals);

                $current_font .= 'wght@'.$weightString;
            }

        } else {
            if (isset($font['font_weights']) && !empty($font['font_weights'])) {
                $current_font .= 'wght@' . implode(';', $font['font_weights']);
            }
        }

        $all_fonts[] = $current_font;
    }

    $font_url .= implode('&', $all_fonts) . '&display=swap';


    // Enqueue the font
    wp_enqueue_style('google-fonts-dynamic-slider', $font_url, array(), null);
}
add_action('admin_enqueue_scripts', 'enqueue_admin_fonts');



function enqueue_backend_script($hook) {
    if ('settings_page_dynamic-banner' !== $hook) {
        return; // Only load the script on the Dynamic Banner settings page.
    }
    wp_enqueue_script( 'custom-backend-script', plugins_url( 'src/js/admin.js', __FILE__ ), array( 'jquery' ), '1.01', true );
}
add_action( 'admin_enqueue_scripts', 'enqueue_backend_script' );

function enqueue_editor_script() {
    wp_enqueue_script( 'custom-script', plugins_url( 'src/js/script.js', __FILE__ ), array( 'jquery' ), '1.01', true );
}
add_action( 'admin_enqueue_scripts', 'enqueue_editor_script' );




/*add_action('wp_head', 'dynamic_banner_add_font_links');

function dynamic_banner_add_font_links() {
    if (get_option('dynamic_banner_include_font_link')) {
        echo '<link rel="preconnect" href="https://fonts.googleapis.com">';
        echo '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>';
        echo '<link href="' . esc_url(get_option('dynamic_banner_font_link')) . '" rel="stylesheet">';
    }
}*/






