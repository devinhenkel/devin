'use client';

import React, { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  VStack,
  HStack,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

interface Persona {
  id: string;
  name: string;
  age: number;
  gender: string;
  occupation: string;
  location: string;
  bio: string;
  goals: string[];
  frustrations: string[];
}

export default function Home() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCreating, setIsCreating] = useState(false);
  const [newPersona, setNewPersona] = useState<Partial<Persona>>({
    goals: [],
    frustrations: [],
  });

  const [newGoal, setNewGoal] = useState('');
  const [newFrustration, setNewFrustration] = useState('');

  const handleCreatePersona = () => {
    setIsCreating(true);
    setNewPersona({
      goals: [],
      frustrations: [],
    });
    onOpen();
  };

  const handleSavePersona = () => {
    if (newPersona.name) {
      const persona: Persona = {
        id: Date.now().toString(),
        name: newPersona.name,
        age: Number(newPersona.age) || 0,
        gender: newPersona.gender || '',
        occupation: newPersona.occupation || '',
        location: newPersona.location || '',
        bio: newPersona.bio || '',
        goals: newPersona.goals || [],
        frustrations: newPersona.frustrations || [],
      };
      setPersonas([...personas, persona]);
      onClose();
      setIsCreating(false);
    }
  };

  const handleViewPersona = (persona: Persona) => {
    setSelectedPersona(persona);
    setIsCreating(false);
    onOpen();
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setNewPersona({
        ...newPersona,
        goals: [...(newPersona.goals || []), newGoal.trim()],
      });
      setNewGoal('');
    }
  };

  const handleAddFrustration = () => {
    if (newFrustration.trim()) {
      setNewPersona({
        ...newPersona,
        frustrations: [...(newPersona.frustrations || []), newFrustration.trim()],
      });
      setNewFrustration('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setNewPersona({
      ...newPersona,
      goals: (newPersona.goals || []).filter((_, i) => i !== index),
    });
  };

  const handleRemoveFrustration = (index: number) => {
    setNewPersona({
      ...newPersona,
      frustrations: (newPersona.frustrations || []).filter((_, i) => i !== index),
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <HStack justify="space-between" mb={6}>
        <Heading>UX Persona Generator</Heading>
        <IconButton
          aria-label="Create new persona"
          icon={<AddIcon />}
          onClick={handleCreatePersona}
          colorScheme="blue"
        />
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {personas.map((persona) => (
          <Card
            key={persona.id}
            cursor="pointer"
            onClick={() => handleViewPersona(persona)}
            _hover={{ shadow: 'lg' }}
          >
            <CardBody>
              <VStack align="start">
                <Heading size="md">{persona.name}</Heading>
                <Text>{persona.occupation}</Text>
                <Text fontSize="sm" color="gray.500">
                  {persona.location}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {isCreating ? 'Create New Persona' : selectedPersona?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {isCreating ? (
              <VStack spacing={4} align="stretch">
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={newPersona.name || ''}
                    onChange={(e) =>
                      setNewPersona({ ...newPersona, name: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Age</FormLabel>
                  <Input
                    type="number"
                    value={newPersona.age || ''}
                    onChange={(e) =>
                      setNewPersona({ ...newPersona, age: Number(e.target.value) })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Gender</FormLabel>
                  <Input
                    value={newPersona.gender || ''}
                    onChange={(e) =>
                      setNewPersona({ ...newPersona, gender: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Occupation</FormLabel>
                  <Input
                    value={newPersona.occupation || ''}
                    onChange={(e) =>
                      setNewPersona({ ...newPersona, occupation: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Input
                    value={newPersona.location || ''}
                    onChange={(e) =>
                      setNewPersona({ ...newPersona, location: e.target.value })
                    }
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Bio</FormLabel>
                  <Textarea
                    value={newPersona.bio || ''}
                    onChange={(e) =>
                      setNewPersona({ ...newPersona, bio: e.target.value })
                    }
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Goals</FormLabel>
                  <List spacing={2}>
                    {newPersona.goals?.map((goal, index) => (
                      <ListItem key={index}>
                        <HStack>
                          <ListIcon as={CheckIcon} color="green.500" />
                          <Text flex="1">{goal}</Text>
                          <IconButton
                            size="sm"
                            icon={<CloseIcon />}
                            aria-label="Remove goal"
                            onClick={() => handleRemoveGoal(index)}
                          />
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                  <HStack mt={2}>
                    <Input
                      value={newGoal}
                      onChange={(e) => setNewGoal(e.target.value)}
                      placeholder="Add a goal"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddGoal()}
                    />
                    <IconButton
                      icon={<AddIcon />}
                      aria-label="Add goal"
                      onClick={handleAddGoal}
                    />
                  </HStack>
                </FormControl>

                <FormControl>
                  <FormLabel>Frustrations</FormLabel>
                  <List spacing={2}>
                    {newPersona.frustrations?.map((frustration, index) => (
                      <ListItem key={index}>
                        <HStack>
                          <ListIcon as={CloseIcon} color="red.500" />
                          <Text flex="1">{frustration}</Text>
                          <IconButton
                            size="sm"
                            icon={<CloseIcon />}
                            aria-label="Remove frustration"
                            onClick={() => handleRemoveFrustration(index)}
                          />
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                  <HStack mt={2}>
                    <Input
                      value={newFrustration}
                      onChange={(e) => setNewFrustration(e.target.value)}
                      placeholder="Add a frustration"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddFrustration()}
                    />
                    <IconButton
                      icon={<AddIcon />}
                      aria-label="Add frustration"
                      onClick={handleAddFrustration}
                    />
                  </HStack>
                </FormControl>

                <Button colorScheme="blue" onClick={handleSavePersona}>
                  Save Persona
                </Button>
              </VStack>
            ) : (
              selectedPersona && (
                <VStack align="start" spacing={4}>
                  <Text><strong>Age:</strong> {selectedPersona.age}</Text>
                  <Text><strong>Gender:</strong> {selectedPersona.gender}</Text>
                  <Text><strong>Occupation:</strong> {selectedPersona.occupation}</Text>
                  <Text><strong>Location:</strong> {selectedPersona.location}</Text>
                  <Text><strong>Bio:</strong> {selectedPersona.bio}</Text>

                  <Box>
                    <Text mb={2}><strong>Goals:</strong></Text>
                    <List spacing={2}>
                      {selectedPersona.goals.map((goal, index) => (
                        <ListItem key={index}>
                          <HStack>
                            <ListIcon as={CheckIcon} color="green.500" />
                            <Text>{goal}</Text>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Box>
                    <Text mb={2}><strong>Frustrations:</strong></Text>
                    <List spacing={2}>
                      {selectedPersona.frustrations.map((frustration, index) => (
                        <ListItem key={index}>
                          <HStack>
                            <ListIcon as={CloseIcon} color="red.500" />
                            <Text>{frustration}</Text>
                          </HStack>
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </VStack>
              )
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
}
