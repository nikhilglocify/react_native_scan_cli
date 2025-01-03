import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome';
export function MaterialIcons({
  name,
  size = 28, // Default size
  color="black",
  ...props // Accept additional dynamic props
}: {
  name: React.ComponentProps<typeof MaterialCommunityIcons>["name"];
  size?: number;
  color?: string;
  [key: string]: any; // Allow other dynamic props
}) {
  return <MaterialCommunityIcons name={name} size={size} color={color} {...props} />;
}

export function FontAwesomeIcon({
  name,
  size = 28, // Default size
  color="#fff",
  ...props // Accept additional dynamic props
}: {
  name: React.ComponentProps<typeof Icon>["name"];
  size?: number;
  color?: string;
  [key: string]: any; // Allow other dynamic props
}) {
  return <Icon name={name} size={size} color={color} {...props}  />;
}


