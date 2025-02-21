<template>
    <v-container fluid class="pa-4">
        <v-card class="mb-4" elevation="2">
            <v-card-text>
                <v-row>
                    <v-col cols="12" class="text-center">
                        <v-avatar size="120" class="elevation-6">
                            <v-img :src="profile?.profilePictureUrl || defaultAvatar" />
                        </v-avatar>
                    </v-col>

                    <v-col cols="12" class="text-center">
                        <h2 class="mt-2">
                            {{ profile?.name || "No Profile Found" }}
                        </h2>
                        <div v-if="profile">
                            <!-- Compute and display age from birthDate -->
                            <div v-if="profile.birthDate">
                                <strong>Age:</strong> {{ computedAge }}
                            </div>
                            <div><strong>Height:</strong> {{ profile.height }} cm</div>
                            <div><strong>Weight:</strong> {{ profile.weight }} kg</div>
                            <div v-if="bmi"><strong>BMI:</strong> {{ bmi.toFixed(1) }}</div>
                            <div><strong>Gender:</strong> {{ profile.gender }}</div>
                            <div v-if="profile.bio" class="mt-2">
                                <strong>About Me:</strong>
                                <p>{{ profile.bio }}</p>
                            </div>
                            <div v-if="profile.goals" class="mt-2">
                                <strong>Fitness Goals:</strong>
                                <p>{{ profile.goals }}</p>
                            </div>
                        </div>
                        <v-btn class="mt-4" color="primary" @click="openEditDialog">
                            {{ profile ? "Edit Profile" : "Create Profile" }}
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Edit Profile Dialog -->
        <v-dialog v-model="editDialog" max-width="600">
            <v-card>
                <v-card-title>
                    <span class="text-h5">
                        {{ profile ? "Edit Profile" : "Create Profile" }}
                    </span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="form" v-model="formValid">
                        <v-text-field
                            variant="outlined"
                            v-model="editedProfile.name"
                            label="Full Name"
                            :rules="[rules.required]"
                        />
                        <v-date-input
                            v-model="birthDateModel"
                            clearable
                            label="Birth Date"
                            variant="outlined"
                            :rules="[rules.required]"
                        />
                        <v-text-field
                            variant="outlined"
                            v-model.number="editedProfile.height"
                            label="Height (cm)"
                            type="number"
                            :rules="[rules.required]"
                        />
                        <v-text-field
                            variant="outlined"
                            v-model.number="editedProfile.weight"
                            label="Weight (kg)"
                            type="number"
                            :rules="[rules.required]"
                        />
                        <v-select
                            variant="outlined"
                            v-model="editedProfile.gender"
                            :items="genderOptions"
                            label="Gender"
                            :rules="[rules.required]"
                        />
                        <v-textarea
                            variant="outlined"
                            v-model="editedProfile.bio"
                            label="About Me"
                            rows="2"
                        />
                        <v-textarea
                            variant="outlined"
                            v-model="editedProfile.goals"
                            label="Fitness Goals"
                            rows="2"
                        />
                        <v-text-field
                            variant="outlined"
                            v-model="editedProfile.profilePictureUrl"
                            label="Profile Picture URL"
                        />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="editDialog = false">Cancel</v-btn>
                    <v-btn color="primary" :disabled="!formValid" @click="saveProfile">
                        Save
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { useAsyncState } from "@vueuse/core";
import { computed, ref, watch } from "vue";

import type { UserProfile } from "../services/user";

import { notify, notifyError } from "../composables/useNotify";
import { auth } from "../firebase";
import { getUserProfile, updateUserProfile } from "../services/user";

const defaultAvatar = "https://placehold.co/150x150.png";
const genderOptions = ["Male", "Female"];

const { error, state: profile } = useAsyncState<null | UserProfile>(async () => {
    if (!auth.currentUser) return null;
    try {
        return await getUserProfile(auth.currentUser.uid);
    } catch (err) {
        return null;
    }
}, null);

watch(error, function (err) {
    if (err) {
        notifyError(err);
    }
});

const editDialog = ref(false);
const form = ref();
const formValid = ref(false);

const editedProfile = ref<UserProfile>({
    bio: "",
    birthDate: "",
    gender: "Male",
    goals: "",
    height: 0,
    id: "",
    name: "",
    profilePictureUrl: "",
    weight: 0,
});

const rules = {
    required: (value: unknown) => Boolean(value) || "Required.",
};

function openEditDialog(): void {
    if (profile.value) {
        editedProfile.value = { ...profile.value };
    } else {
        editedProfile.value = {
            bio: "",
            birthDate: "",
            gender: "Male",
            goals: "",
            height: 0,
            id: auth.currentUser?.uid ?? "",
            name: "",
            profilePictureUrl: "",
            weight: 0,
        };
    }
    editDialog.value = true;
}

async function saveProfile(): Promise<void> {
    if (!auth.currentUser) return;

    try {
        await updateUserProfile(auth.currentUser.uid, editedProfile.value);
        notify("Profile saved successfully!");
        profile.value = { ...editedProfile.value };
        editDialog.value = false;
    } catch (e) {
        notifyError(e);
    }
}

const bmi = computed(() => {
    if (profile.value?.height && profile.value.weight) {
        const heightInMeters = profile.value.height / 100;
        return profile.value.weight / (heightInMeters * heightInMeters);
    }
    return null;
});

const computedAge = computed(() => {
    if (profile.value?.birthDate) {
        const birth = new Date(profile.value.birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const month = today.getMonth() - birth.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age;
    }
    return "";
});

const birthDateModel = computed({
    get() {
        return editedProfile.value.birthDate ? new Date(editedProfile.value.birthDate) : null;
    },
    set(newValue: Date | null) {
        if (newValue) {
            editedProfile.value.birthDate = newValue.toISOString().split("T")[0];
        } else {
            editedProfile.value.birthDate = "";
        }
    },
});
</script>
