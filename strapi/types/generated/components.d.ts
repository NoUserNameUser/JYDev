import type { Schema, Struct } from '@strapi/strapi';

export interface GridBackground extends Struct.ComponentSchema {
  collectionName: 'components_grid_backgrounds';
  info: {
    description: 'Grid background color and optional image';
    displayName: 'Background';
  };
  attributes: {
    color: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#ffffff'>;
    imageAlt: Schema.Attribute.String;
    imageOpacity: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 1;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0.88>;
    imageSrc: Schema.Attribute.String;
  };
}

export interface GridButton extends Struct.ComponentSchema {
  collectionName: 'components_grid_buttons';
  info: {
    description: 'Call to action button';
    displayName: 'Button';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    variant: Schema.Attribute.Enumeration<['primary', 'secondary', 'text']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'primary'>;
  };
}

export interface GridImage extends Struct.ComponentSchema {
  collectionName: 'components_grid_images';
  info: {
    description: 'Image URL and optional caption';
    displayName: 'Image';
  };
  attributes: {
    alt: Schema.Attribute.String;
    caption: Schema.Attribute.String;
    placement: Schema.Attribute.Enumeration<['inline', 'background']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'inline'>;
    src: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface GridLink extends Struct.ComponentSchema {
  collectionName: 'components_grid_links';
  info: {
    description: 'Inline editorial link';
    displayName: 'Link';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface GridShape extends Struct.ComponentSchema {
  collectionName: 'components_grid_shapes';
  info: {
    description: 'Decorative background shape for a grid';
    displayName: 'Shape';
  };
  attributes: {
    color: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'rgba(53, 47, 42, 0.16)'>;
    height: Schema.Attribute.String & Schema.Attribute.DefaultTo<'86px'>;
    name: Schema.Attribute.String;
    opacity: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          max: 1;
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<1>;
    rotation: Schema.Attribute.Decimal & Schema.Attribute.DefaultTo<0>;
    shape: Schema.Attribute.Enumeration<['triangle', 'circle', 'rectangle']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'triangle'>;
    width: Schema.Attribute.String & Schema.Attribute.DefaultTo<'16%'>;
    x: Schema.Attribute.String & Schema.Attribute.DefaultTo<'50%'>;
    y: Schema.Attribute.String & Schema.Attribute.DefaultTo<'20%'>;
    zIndex: Schema.Attribute.Integer & Schema.Attribute.DefaultTo<1>;
  };
}

export interface GridText extends Struct.ComponentSchema {
  collectionName: 'components_grid_texts';
  info: {
    description: 'Eyebrow, heading, and body copy for a grid panel';
    displayName: 'Text';
  };
  attributes: {
    body: Schema.Attribute.Text;
    eyebrow: Schema.Attribute.String;
    heading: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'grid.background': GridBackground;
      'grid.button': GridButton;
      'grid.image': GridImage;
      'grid.link': GridLink;
      'grid.shape': GridShape;
      'grid.text': GridText;
    }
  }
}
