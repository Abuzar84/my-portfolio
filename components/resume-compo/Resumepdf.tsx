import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
        color: '#333'
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#111',
        paddingBottom: 10,
    },
    name: {
        fontSize: 28,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
        color: '#111',
    },
    contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: 9,
        color: '#666',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginTop: 18,
        marginBottom: 8,
        color: '#111',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 2,
        letterSpacing: 0.5,
    },
    itemBlock: {
        marginBottom: 8,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    itemTitle: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#222',
    },
    itemSubtitle: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#444',
    },
    itemDate: {
        fontSize: 9,
        color: '#666',
        fontStyle: 'italic',
    },
    description: {
        fontSize: 10,
        color: '#444',
        marginTop: 2,
    },
    skillText: {
        fontSize: 10,
        lineHeight: 1.6,
    }
});

export interface EducationItem {
    id: string;
    institution: string;
    degree: string;
    year: string;
    description: string;
}

export interface ExperienceItem {
    id: string;
    company: string;
    role: string;
    year: string;
    description: string;
}

export interface ResumeData {
    name: string;
    email: string;
    phone: string;
    address: string;
    summary: string;
    education: EducationItem[];
    experience: ExperienceItem[];
    skills: string;
}

export default function ResumePDF({ data }: { data: ResumeData }) {
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.name}>{data.name || 'YOUR NAME'}</Text>
                    <View style={styles.contactRow}>
                        {data.email ? <Text>{data.email}</Text> : null}
                        {data.phone ? <Text>• {data.phone}</Text> : null}
                        {data.address ? <Text>• {data.address}</Text> : null}
                    </View>
                </View>

                {/* Summary */}
                {data.summary ? (
                    <View>
                        <Text style={styles.sectionTitle}>Summary</Text>
                        <Text style={styles.description}>{data.summary}</Text>
                    </View>
                ) : null}

                {/* Experience */}
                {data.experience.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Experience</Text>
                        {data.experience.map((exp, index) => (
                            <View key={index} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{exp.company || 'Company Name'}</Text>
                                    <Text style={styles.itemDate}>{exp.year}</Text>
                                </View>
                                {exp.role ? <Text style={styles.itemSubtitle}>{exp.role}</Text> : null}
                                {exp.description ? <Text style={styles.description}>{exp.description}</Text> : null}
                            </View>
                        ))}
                    </View>
                )}

                {/* Education */}
                {data.education.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>Education</Text>
                        {data.education.map((edu, index) => (
                            <View key={index} style={styles.itemBlock}>
                                <View style={styles.itemHeader}>
                                    <Text style={styles.itemTitle}>{edu.institution || 'University Name'}</Text>
                                    <Text style={styles.itemDate}>{edu.year}</Text>
                                </View>
                                {edu.degree ? <Text style={styles.itemSubtitle}>{edu.degree}</Text> : null}
                                {edu.description ? <Text style={styles.description}>{edu.description}</Text> : null}
                            </View>
                        ))}
                    </View>
                )}

                {/* Skills */}
                {data.skills ? (
                    <View>
                        <Text style={styles.sectionTitle}>Skills</Text>
                        <Text style={styles.skillText}>{data.skills}</Text>
                    </View>
                ) : null}
            </Page>
        </Document>
    );
}