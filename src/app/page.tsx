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
  useToast,
  Spinner,
  Avatar,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon, CloseIcon, RepeatIcon } from '@chakra-ui/icons';

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
  profilePicture?: string;  // URL to stored image
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://persona-generator-bbzhffsc.fly.dev';

export default function Home() {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isCreating, setIsCreating] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [productDescription, setProductDescription] = useState('');
  const [newPersona, setNewPersona] = useState<Partial<Persona>>({
    goals: [],
    frustrations: [],
  });
  const toast = useToast();

  const [newGoal, setNewGoal] = useState('');
  const [newFrustration, setNewFrustration] = useState('');
  const [regeneratingFields, setRegeneratingFields] = useState<Record<string, boolean>>({});

  const handleCreatePersona = () => {
    setIsCreating(true);
    setNewPersona({
      goals: [],
      frustrations: [],
    });
    setProductDescription('');
    onOpen();
  };

  const handleGeneratePersona = async () => {
    if (!productDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a product description',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch(`${BACKEND_URL}/generate-persona`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: productDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate persona');
      }

      const data = await response.json();
      setNewPersona(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate persona. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateField = async (field: string) => {
    setRegeneratingFields(prev => ({ ...prev, [field]: true }));
    try {
      const response = await fetch(`${BACKEND_URL}/generate-persona`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: productDescription,
          field,
          currentPersona: newPersona,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to regenerate field');
      }

      const data = await response.json();
      setNewPersona(prev => ({
        ...prev,
        [field]: data[field],
      }));
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to regenerate ${field}. Please try again.`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setRegeneratingFields(prev => ({ ...prev, [field]: false }));
    }
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
              <HStack spacing={4}>
                <Avatar
                  size="lg"
                  src={persona.profilePicture}
                  name={persona.name}
                />
                <VStack align="start">
                  <Heading size="md">{persona.name}</Heading>
                  <Text>{persona.occupation}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {persona.location}
                  </Text>
                </VStack>
              </HStack>
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
                  <FormLabel>Product Description</FormLabel>
                  <Textarea
                    value={productDescription}
                    onChange={(e) => setProductDescription(e.target.value)}
                    placeholder="Describe your product and its target users..."
                  />
                </FormControl>
                <Button
                  colorScheme="blue"
                  onClick={handleGeneratePersona}
                  isLoading={isGenerating}
                  mb={4}
                >
                  Generate Persona
                </Button>

                {Object.keys(newPersona).length > 2 && (
                  <>
                    <FormControl>
                      <FormLabel>Profile Picture</FormLabel>
                      <VStack align="stretch">
                        <Avatar
                          size="2xl"
                          src={newPersona.profilePicture}
                          name={newPersona.name}
                          mb={2}
                        />
                        <IconButton
                          icon={regeneratingFields.profilePicture ? <Spinner size="sm" /> : <RepeatIcon />}
                          aria-label="Regenerate profile picture"
                          onClick={() => handleRegenerateField('profilePicture')}
                          isDisabled={regeneratingFields.profilePicture}
                          alignSelf="flex-end"
                        />
                      </VStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Name</FormLabel>
                      <HStack>
                        <Input
                          flex="1"
                          value={newPersona.name || ''}
                          onChange={(e) =>
                            setNewPersona({ ...newPersona, name: e.target.value })
                          }
                        />
                        <IconButton
                          icon={regeneratingFields.name ? <Spinner size="sm" /> : <RepeatIcon />}
                          aria-label="Regenerate name"
                          onClick={() => handleRegenerateField('name')}
                          isDisabled={regeneratingFields.name}
                        />
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Age</FormLabel>
                      <HStack>
                        <Input
                          flex="1"
                          type="number"
                          value={newPersona.age || ''}
                          onChange={(e) =>
                            setNewPersona({ ...newPersona, age: Number(e.target.value) })
                          }
                        />
                        <IconButton
                          icon={regeneratingFields.age ? <Spinner size="sm" /> : <RepeatIcon />}
                          aria-label="Regenerate age"
                          onClick={() => handleRegenerateField('age')}
                          isDisabled={regeneratingFields.age}
                        />
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Gender</FormLabel>
                      <HStack>
                        <Input
                          flex="1"
                          value={newPersona.gender || ''}
                          onChange={(e) =>
                            setNewPersona({ ...newPersona, gender: e.target.value })
                          }
                        />
                        <IconButton
                          icon={regeneratingFields.gender ? <Spinner size="sm" /> : <RepeatIcon />}
                          aria-label="Regenerate gender"
                          onClick={() => handleRegenerateField('gender')}
                          isDisabled={regeneratingFields.gender}
                        />
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Occupation</FormLabel>
                      <HStack>
                        <Input
                          flex="1"
                          value={newPersona.occupation || ''}
                          onChange={(e) =>
                            setNewPersona({ ...newPersona, occupation: e.target.value })
                          }
                        />
                        <IconButton
                          icon={regeneratingFields.occupation ? <Spinner size="sm" /> : <RepeatIcon />}
                          aria-label="Regenerate occupation"
                          onClick={() => handleRegenerateField('occupation')}
                          isDisabled={regeneratingFields.occupation}
                        />
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Location</FormLabel>
                      <HStack>
                        <Input
                          flex="1"
                          value={newPersona.location || ''}
                          onChange={(e) =>
                            setNewPersona({ ...newPersona, location: e.target.value })
                          }
                        />
                        <IconButton
                          icon={regeneratingFields.location ? <Spinner size="sm" /> : <RepeatIcon />}
                          aria-label="Regenerate location"
                          onClick={() => handleRegenerateField('location')}
                          isDisabled={regeneratingFields.location}
                        />
                      </HStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Bio</FormLabel>
                      <VStack align="stretch">
                        <Textarea
                          value={newPersona.bio || ''}
                          onChange={(e) =>
                            setNewPersona({ ...newPersona, bio: e.target.value })
                          }
                        />
                        <IconButton
                          icon={regeneratingFields.bio ? <Spinner size="sm" /> : <RepeatIcon />}
                          aria-label="Regenerate bio"
                          onClick={() => handleRegenerateField('bio')}
                          isDisabled={regeneratingFields.bio}
                          alignSelf="flex-end"
                        />
                      </VStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Goals</FormLabel>
                      <VStack align="stretch" spacing={2}>
                        <HStack>
                          <Text flex="1">Goals List</Text>
                          <IconButton
                            icon={regeneratingFields.goals ? <Spinner size="sm" /> : <RepeatIcon />}
                            aria-label="Regenerate all goals"
                            onClick={() => handleRegenerateField('goals')}
                            isDisabled={regeneratingFields.goals}
                            size="sm"
                          />
                        </HStack>
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
                      </VStack>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Frustrations</FormLabel>
                      <VStack align="stretch" spacing={2}>
                        <HStack>
                          <Text flex="1">Frustrations List</Text>
                          <IconButton
                            icon={regeneratingFields.frustrations ? <Spinner size="sm" /> : <RepeatIcon />}
                            aria-label="Regenerate all frustrations"
                            onClick={() => handleRegenerateField('frustrations')}
                            isDisabled={regeneratingFields.frustrations}
                            size="sm"
                          />
                        </HStack>
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
                      </VStack>
                    </FormControl>

                    <Button colorScheme="blue" onClick={handleSavePersona}>
                      Save Persona
                    </Button>
                  </>
                )}
              </VStack>
            ) : (
              selectedPersona && (
                <VStack align="start" spacing={4}>
                  <Avatar
                    size="2xl"
                    src={selectedPersona.profilePicture}
                    name={selectedPersona.name}
                    mb={4}
                  />
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
