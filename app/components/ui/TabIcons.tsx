import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

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
